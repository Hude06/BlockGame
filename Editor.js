// JavaScript object
const data = {
    name: 'John Doe',
    age: 25,
    city: 'Exampleville'
};
// Modify the data

document.getElementById("New Level").addEventListener("click", function() {
    console.log("New Level")
    const string = JSON.parse(data);
    string.age = 26;
    string.city = 'New City';
    const modifiedJsonString = JSON.stringify(string, null, 2);
    console.log(modifiedJsonString)

});
  const blob = new Blob([data], { type: 'application/json' });
  
  // Create a temporary download link
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = 'data.json';
  
  // Trigger the download
//   downloadLink.click();