const search = document.querySelector('#search');
const submit = document.querySelector('#submit');
const random = document.querySelector('#random');
const mealsEl = document.querySelector('#meals');
const resultHeading = document.querySelector('#result-heading');
const single_mealEl = document.querySelector('#single-meal');

//functions
const searchMeal = (e) => {
    e.preventDefault();

    single_mealEl.innerHTML = '';

    const term = search.value;

    if(term.trim()){
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
        .then(res => res.json())
        .then(data =>{
            console.log(data);
            resultHeading.innerHTML = `<h2>Search result for ${term}</h2>`;

            if(data.meals === null){
                resultHeading.innerHTML = `<h2>LOX</h2>`
            } else {
                mealsEl.innerHTML = data.meals.map( meal => `
                <div class="meal">
                    <img src="${meal.strMealThumb}" alt="meal">
                    <div class="meal-info" data-mealID=${meal.idMeal}>
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>
                `).join('');
            }
        })
        //Clear
        search.value = '';
    } else {
        alert('lox');
    }
    
}

const getMealById = mealID => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        if(data){
            const meal = data.meals[0];
            addMealToDom(meal);
        }
    })

}

const getMealByRandom = () => {
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        if(data){
            const meal = data.meals[0];
            addMealToDom(meal);
        }
    })
}

function addMealToDom(meal){
    const ingredients = [];

    for (let i = 1; i <= 20; i++){
        if(meal[`strIngredient${i}`]){
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }
            single_mealEl.innerHTML = `
                <h2>Recept of ${meal.strMeal}</h2>
                <img src="${meal.strMealThumb}" class="single-meal__img" alt="">
                <h2>Ingredients</h2>
                <ul class="list-none">
                    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
                <p>${meal.strInstructions}</p>
                <a href="${meal.strYoutube}" class="watch-video">Watch video</a>
            `;
}

const showMeal = e => {
    const mealInfo = e.path.find(item => {
        if(item.classList){
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });
    
    if(mealInfo){
        const id = mealInfo.dataset.mealid;
        getMealById(id);
    }
    
}

//Event
submit.addEventListener('submit', searchMeal);
mealsEl.addEventListener('click', showMeal);
random.addEventListener('click', getMealByRandom);