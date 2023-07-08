const spawner = require('child_process').spawn;

const data_to_pass_in = [19,1,26,2,89,1,1];
const python_process = spawner('python',['model.py',JSON.stringify(data_to_pass_in)])
python_process.stdout.on('data',(data)=>{
  // places=(data.toString().split('\r\n'))
  // console.log(places)
  console.log(typeof(JSON.parse(data)))
});
// const { PythonShell } = require('python-shell');

// const modelPath = 'C:/Users/DELL/Desktop/Indian Railways/model.pkl';

// // Define the input data
// const inputData = [19, 1, 26, 2, 89, 1, 1];

// // Configure the PythonShell options
// const options = {
//   mode: 'text',
//   pythonPath: 'python',
//   pythonOptions: ['-u'], // Unbuffered output
//   scriptPath: '',
//   args: [JSON.stringify(inputData)]
// };

// // Create a new PythonShell instance
// const pyShell = new PythonShell('model.py', options);

// // Run the Python script and handle the output
// pyShell.on('message', (message) => {
//   // Parse the result as a JSON string
//   const result = JSON.parse(message);

//   // Log the result
//   console.log(result);
// });

// // Handle errors
// pyShell.on('error', (err) => {
//   console.error(err);
// });
