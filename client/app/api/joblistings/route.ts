import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function GET() {
  try {
    // Full path to the Python script
    const pythonScriptPath = "C:\\Users\\suhas\\OneDrive\\Desktop\\Job_analyser\\job-analyser\\scripts\\justnaukriposts.py";
    console.log(`Python script path: ${pythonScriptPath}`);

    // Run the Python script using spawn
    const result = await new Promise<any>((resolve, reject) => {
      console.log('Executing Python script...');

      // Spawn a Python process
      const pythonProcess = spawn('python', [pythonScriptPath]);

      let output = '';
      let errorOutput = '';

      // Collect the output from stdout
      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      // Collect the error output
      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      // Handle process close event
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`Python script failed with code ${code}`);
          reject(`stderr: ${errorOutput}`);
        } else {
          console.log('Python script executed successfully.');
          try {
            // Parse the JSON output from the Python script
            const data = JSON.parse(output);
            console.log('Parsed JSON data:', data);
            resolve(data); // Return the parsed data
          } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            reject(`Error parsing JSON: ${parseError}`);
          }
        }
      });
    });

    // Return the scraped data as a JSON response
    console.log('Returning scraped data...');
    return NextResponse.json(result);
  } catch (error) {
    // Handle any errors that occur during execution or parsing
    if (error instanceof Error) {
      console.error('Error occurred:', error.message);
    } else {
      console.error('Error occurred:', error);
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
