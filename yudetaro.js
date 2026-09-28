const drawButton = document.getElementById('drawButton');
const resultArea = document.getElementById('resultArea');
const resultNote = document.getElementById('resultNote');
const categoryOptions = document.getElementById('categoryOptions');
const budgetOptions = document.getElementById('budgetOptions');
const budgetAmount = document.getElementById('budgetAmount');
const headerBudgetAmount = document.getElementById('headerBudgetAmount');
let selectedBudget = yudetaroMenu.defaultBudget;

budgetOptions.innerHTML = yudetaroMenu.budgets.map((budget) => `
    <button class="budget-option" type="button" data-budget="${budget}" aria-pressed="${budget === selectedBudget}">
        ¥${budget.toLocaleString('ja-JP')}
    </button>
`).join('');

function setBudget(budget) {
    selectedBudget = budget;
    budgetOptions.querySelectorAll('.budget-option').forEach((button) => {
        button.setAttribute('aria-pressed', String(Number(button.dataset.budget) === selectedBudget));
    });
    const formattedBudget = `¥${selectedBudget.toLocaleString('ja-JP')}`;
    budgetAmount.textContent = formattedBudget;
    headerBudgetAmount.textContent = formattedBudget;
}

budgetOptions.addEventListener('click', (event) => {
    const button = event.target.closest('.budget-option');
    if (button) setBudget(Number(button.dataset.budget));
});

categoryOptions.innerHTML = [...yudetaroMenu.categories, ...yudetaroMenu.sideCategories].map((category) => `
    <label class="category-option" for="category-${category.id}">
        <input id="category-${category.id}" type="checkbox" value="${category.id}" checked>
        <span>${category.label}</span>
    </label>
`).join('');

function findBestSideCombination(budget, sides) {
    const shuffledSides = [...sides].sort(() => Math.random() - 0.5);
    const reachable = Array.from({ length: shuffledSides.length + 1 }, () => new Uint8Array(budget + 1));
    reachable[0][0] = 1;

    for (let index = 1; index <= shuffledSides.length; index += 1) {
        const price = shuffledSides[index - 1].price;
        for (let amount = 0; amount <= budget; amount += 1) {
            reachable[index][amount] = reachable[index - 1][amount]
                || (amount >= price && reachable[index - 1][amount - price]);
        }
    }

    let total = budget;
    while (!reachable[shuffledSides.length][total]) total -= 1;
    const bestTotal = total;

    const chosen = [];
    for (let index = shuffledSides.length; index > 0; index -= 1) {
        const price = shuffledSides[index - 1].price;
        const canSkip = Boolean(reachable[index - 1][total]);
        const canChoose = total >= price && Boolean(reachable[index - 1][total - price]);

        if (canChoose && (!canSkip || Math.random() < 0.5)) {
            chosen.push(shuffledSides[index - 1]);
            total -= price;
        }
    }

    return { items: chosen, total: bestTotal };
}

function drawMeal() {
    const selectedCategories = [...categoryOptions.querySelectorAll('input:checked')].map((input) => input.value);
    const selectedMeals = yudetaroMenu.categories
        .filter((category) => selectedCategories.includes(category.id))
        .flatMap((category) => category.items.map((meal) => ({ meal, category })));
    const optionalSides = yudetaroMenu.sideCategories
        .filter((category) => selectedCategories.includes(category.id))
        .flatMap((category) => category.items);
    const availableSides = [...yudetaroMenu.sides, ...optionalSides];
    const possibleMeals = selectedMeals
        .filter(({ meal }) => meal.price <= selectedBudget)
        .map(({ meal, category }) => ({
            main: meal,
            category,
            sides: findBestSideCombination(
                selectedBudget - meal.price,
                availableSides.filter((side) => !side.appliesTo || side.appliesTo.includes(category.id))
            )
        }));

    if (possibleMeals.length === 0) {
        resultArea.innerHTML = `<p class="result-placeholder">カテゴリを選ぶか、${selectedBudget.toLocaleString('ja-JP')}円以下のメニューを追加してください。</p>`;
        resultNote.textContent = '選択したカテゴリに予算内のメインメニューがありません。';
        return;
    }

    const bestTotal = Math.max(...possibleMeals.map(({ main, sides }) => main.price + sides.total));
    const bestMeals = possibleMeals.filter(({ main, sides }) => main.price + sides.total === bestTotal);
    const { main, category: mainCategory, sides: sideCombination } = bestMeals[Math.floor(Math.random() * bestMeals.length)];
    const sides = sideCombination.items;
    const items = [main, ...sides];
    const total = main.price + sideCombination.total;

    resultArea.innerHTML = `
        <div class="meal-list">
            ${items.map((item, index) => `
                <div class="meal-item${index === 0 ? ' is-main' : ''}">
                    <span class="meal-label">${index === 0 ? 'MAIN' : 'SIDE'}</span>
                    <span class="meal-name">${item.name}</span>
                    <strong class="meal-price">¥${item.price.toLocaleString('ja-JP')}</strong>
                </div>
            `).join('')}
        </div>
        <div class="meal-total"><span>合計</span><strong>¥${total.toLocaleString('ja-JP')}</strong></div>
    `;
    const remaining = selectedBudget - total;
    resultNote.textContent = `${mainCategory.label}から「${main.name}」を選び、サイド${sides.length}品を追加。${remaining === 0 ? '予算ちょうど！' : `予算まであと¥${remaining.toLocaleString('ja-JP')}。`}`;
    drawButton.classList.remove('is-spinning');
    requestAnimationFrame(() => drawButton.classList.add('is-spinning'));
}

drawButton.addEventListener('click', drawMeal);