let x = 22 + 7 + "b" + 5 + 4;
console.log(x);
let y = "1" + 1 + 1 + 1;
console.log(y);

console.log("*******************");

var myArray = [1, 2, 1, 3, 3, 1, 2, 1, 5, 1];
myArray.sort();
let sinrepetir = [];
let veces = [];
let contador = 0;

for (let i = -1; i < myArray.length; i++) {
  if (myArray[i + 1] === myArray[i]) {
    contador++;
  } else {
    sinrepetir.push(myArray[i]);
    veces.push(contador);
    contador = 1;
  }
}
const truly = (arreglo) => {
  return arreglo.filter((nn) => nn);
};
veces = truly(veces);
sinrepetir = truly(sinrepetir);

for (let i = 0; i < sinrepetir.length; i++) {
var string = "*".repeat(veces[i]);
  console.log(sinrepetir[i] + ":" + string); 
}
