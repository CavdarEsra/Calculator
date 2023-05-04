document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".toggleButon").addEventListener("click", function() {
      document.querySelector(".toggleButon").classList.toggle("active");
      document.querySelector(".calculator").classList.toggle("dark");
    });
  });
  
const display=document.querySelector('#calculator-input');
const keys=document.querySelector('.calculator--keys');
const historyText = document.getElementById("history-text");

let displayValue='0';
let firstValue=null;
let operator=null;
let waitingForSecondValue=false; 
updateDisplay();
//inputu güncelliyor
function updateDisplay(){
    historyText.value += displayValue;
    display.value=displayValue;  //input içindeki değeri displayValue değişkenine atadık
}

keys.addEventListener('click', function(e){  //tuşlara tıklama
    const element=e.target;
    if(!element.matches('button')) return;  
    //matches metodu ile tıklanan eleman mı değil mi diye bakıyoruz.
    //tıklanan buton değil de boşluklar ise gerisini çalıştırma. sadece buton tıklamalarında işlem yap
    if(element.classList.contains('operator')){  
        Operator(element.value);
        updateDisplay();
        return;
    }
    if(element.classList.contains('decimal')){  
        //tıklanan . yani ondalıklı buton ise 
        inputDecimal();
        updateDisplay();
        return;
    }
    if(element.classList.contains('clear')){  
        clear();
        updateDisplay();
        //tıklanan AC yani clear buton ise 
        return;
    }
    if(element.classList.contains('sign')){  
        //tıklanan +/- buton ise 
        toggleSign();
        updateDisplay();        
        return;
    }
    if(element.classList.contains('perc')){  
        //tıklanan % buton ise
        calculatePercentage();
        updateDisplay();        
        return;
    }
    //yukardaki koşullar sağlanmıyorsa tıklanan sayı butonudur ve ekranda tıklanan gösterilir

    inputNumber(element.value);
    updateDisplay();  //her tıklama sonrası inputta yazanlar güncellensin diye çağırdık
});
function Operator(nextOperator){
    const value = parseFloat(displayValue);
    if(operator && waitingForSecondValue){  //= e tıklandıktan sonra işleme devam etmek için yeni operatör ile işleme devam edilir
        operator =nextOperator;
        return;
    }
    if(firstValue===null){  //ilk değer girilmemişse
        firstValue=value;
    }
    else if(operator){      //ilk değer girilmişse
        const result=calculate(firstValue, value, operator);
        displayValue=`${parseFloat(result.toFixed(7))}`;  //sonucu 7 basamakla sınırladık
        firstValue=result;   //sonuç ilk değer olarak saklanır devam etmeyi göz önünde bulundurarak
    }
    waitingForSecondValue=true;  //2.değer bekleniyor. yani operatöre tıklandıktan sonrası
    operator=nextOperator;
    displayValue+=operator;

}
function calculate(first, second, operator){
    if(operator === '+'){
        return first + second;
    }
    else if(operator === '-'){
        return first - second; 
    }
    else if(operator === '*'){
        return first * second; 
    }
    else if(operator === '/'){
        return first / second; 
    }
    return second;
}
function inputNumber(num){

    if(waitingForSecondValue){   //2.değer bekleniyorsa tıklananı al displayvalue ata. sonra bekleme inputu boşalt
        displayValue=num;
        waitingForSecondValue=false;
    }else{
        displayValue=displayValue === '0' ? num : displayValue + num ;
    }
    //inputta 0 yazıyorsa henüz değer girilmemiştir, num değerini aktarırız. 0 değilse de inputun sonuna yeni tıkanan aktarılır
}
function inputDecimal(){
    if(!displayValue.includes('.')){  //daha önce . ya tıklanmamışsa tıklandığında sonuna . ekler
        displayValue += '.';
    }
}
function clear(){
    displayValue='0';
}
function toggleSign(){
    displayValue = displayValue.charAt(0) === '-' ? displayValue.slice(1) : `-${displayValue}`;
}
function calculatePercentage(){
    const value = parseFloat(displayValue);
    displayValue = `${value * 0.01}`;
}
document.addEventListener('keydown', function(event) {
    const key = event.key;
    if (/[0-9]/.test(key)) {
      inputNumber(key);
      updateDisplay();
    } else if (/\+|\-|\*|\//.test(key)) {
      Operator(key);
      updateDisplay();
    } else if (key === '.') {
      inputDecimal();
      updateDisplay();
    } else if (key === 'Enter') {
      const value = parseFloat(displayValue);
      if (firstValue === null) {
        firstValue = value;
      } else if (operator) {
        const result = calculate(firstValue, value, operator);
        displayValue = `${parseFloat(result.toFixed(7))}`;
        firstValue = result;
      }
      waitingForSecondValue = true;
      operator = null;
      updateDisplay();
    }
  });
  