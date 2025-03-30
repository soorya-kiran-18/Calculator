document.addEventListener('DOMContentLoaded', () => {
    const result = document.getElementById('result');
    const buttons = document.querySelectorAll('button');
    const themeToggle = document.getElementById('themeToggle');
    const ageBtn = document.getElementById('ageBtn');
    const bmiBtn = document.getElementById('bmiBtn');
    const ageModal = document.getElementById('ageModal');
    const bmiModal = document.getElementById('bmiModal');
    const dobInput = document.getElementById('dobInput');
    const weightInput = document.getElementById('weightInput');
    const heightInput = document.getElementById('heightInput');
    const calculateAge = document.getElementById('calculateAge');
    const calculateBMI = document.getElementById('calculateBMI');
    const closeAgeModal = document.getElementById('closeAgeModal');
    const closeBMIModal = document.getElementById('closeBMIModal');
    let currentValue = '';
    let previousValue = '';
    let operation = null;


    themeToggle.addEventListener('click', () => {
        document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
        themeToggle.textContent = document.body.dataset.theme === 'dark' ? '☀️' : '🌙';
    });


    ageBtn.addEventListener('click', () => {
        ageModal.style.display = 'block';
    });

    closeAgeModal.addEventListener('click', () => {
        ageModal.style.display = 'none';
        dobInput.value = '';
    });


    bmiBtn.addEventListener('click', () => {
        bmiModal.style.display = 'block';
    });

    closeBMIModal.addEventListener('click', () => {
        bmiModal.style.display = 'none';
        weightInput.value = '';
        heightInput.value = '';
    });

    window.addEventListener('click', (e) => {
        if (e.target === ageModal) {
            ageModal.style.display = 'none';
            dobInput.value = '';
        }
        if (e.target === bmiModal) {
            bmiModal.style.display = 'none';
            weightInput.value = '';
            heightInput.value = '';
        }
    });

    calculateAge.addEventListener('click', () => {
        const dob = dobInput.value.trim();
        if (!isValidDateFormat(dob)) {
            alert('Please enter a valid date in DD-MM-YYYY format');
            return;
        }

        const age = calculateAgeFromDOB(dob);
        result.value = age;
        ageModal.style.display = 'none';
        dobInput.value = '';
    });

    calculateBMI.addEventListener('click', () => {
        const weight = parseFloat(weightInput.value);
        const height = parseFloat(heightInput.value) / 100; 

        if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
            alert('Please enter valid weight and height values');
            return;
        }

        const bmi = calculateBMIValue(weight, height);
        result.value = bmi.toFixed(1);
        bmiModal.style.display = 'none';
        weightInput.value = '';
        heightInput.value = '';
    });

    function isValidDateFormat(dateStr) {
        const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
        if (!regex.test(dateStr)) return false;

        const [_, day, month, year] = dateStr.match(regex);
        const date = new Date(year, month - 1, day);
        
        return date.getDate() == day &&
               date.getMonth() == month - 1 &&
               date.getFullYear() == year &&
               date <= new Date();
    }

    function calculateAgeFromDOB(dob) {
        const [day, month, year] = dob.split('-').map(Number);
        const birthDate = new Date(year, month - 1, day);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }

    function calculateBMIValue(weight, height) {
        return weight / (height * height);
    }


    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;

            if (button.classList.contains('number')) {
                currentValue += value;
                result.value = currentValue;
            } else if (button.classList.contains('operator')) {
                if (currentValue === '') return;
                if (previousValue !== '') {
                    calculate();
                }
                operation = value;
                previousValue = currentValue;
                currentValue = '';
            } else if (button.classList.contains('equals')) {
                if (currentValue === '' || previousValue === '') return;
                calculate();
                operation = null;
                previousValue = '';
                return;
            } else if (button.classList.contains('clear')) {
                currentValue = '';
                previousValue = '';
                operation = null;
                result.value = '';
            } else if (button.classList.contains('function')) {
                if (currentValue === '') return;
                const num = parseFloat(currentValue);
                let computation;

                switch (value) {
                    case 'x²':
                        computation = num * num;
                        break;
                    case 'x³':
                        computation = num * num * num;
                        break;
                    case 'log':
                        if (num <= 0) {
                            result.value = 'Error';
                            return;
                        }
                        computation = Math.log10(num);
                        break;
                    case 'ln':
                        if (num <= 0) {
                            result.value = 'Error';
                            return;
                        }
                        computation = Math.log(num);
                        break;
                }

                currentValue = computation.toString();
                result.value = currentValue;
            }
        });
    });

    function calculate() {
        let computation;
        const prev = parseFloat(previousValue);
        const current = parseFloat(currentValue);

        switch (operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    result.value = 'Error';
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }

        currentValue = computation.toString();
        result.value = currentValue;
    }
}); 