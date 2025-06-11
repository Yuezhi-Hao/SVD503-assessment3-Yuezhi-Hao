
const readline = require('readline');
const fs = require('fs');

// Define the file name for storing patient data in JSON format
const FILE = 'patients.json';

// initialize patients array; load data from the file if it exists
let patients = [];
if (fs.existsSync(FILE)) {
  try {
    patients = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch {
    patients = [];
  }
}
//Represents the readline interface, used for command line input and output.
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Save patient data to a JSON file
function savePatients() {
  fs.writeFileSync(FILE, JSON.stringify(patients, null, 2));
}

// Find the patient object by ID
function findPatientById(id) {
  for (let i = 0; i < patients.length; i++) {
    if (patients[i].id === id) {
      return patients[i];
    }
  }
  return null;
}

// Generate a new patient ID, such as "001"
function generatePatientId() {
  const num = patients.length + 1;
  return String(num).padStart(3, '0');
}

// Add patient details
function addPatient() {
  console.log('\npatient Details');
  rl.question('name：', function(name) {
    if (!name.trim()) {
      console.log('The name cannot be empty\n');
      return patientMenu();
    }
    rl.question('Gender (Male/Female/Other):', function(gender) {
      if (!gender.trim()) {
        console.log('Gender cannot be empty\n');
        return patientMenu();
      }
      rl.question('Date of Birth (Format YYYY-MM-DD):', function(birth) {
        if (!birth.trim()) {
          console.log('Date of Birth cannot be empty\n');
          return patientMenu();
        }
        rl.question('address:', function(address) {
          if (!address.trim()) {
            console.log('The address cannot be empty\n');
            return patientMenu();
          }
          rl.question('Contact Details:', function(contact) {
            if (!contact.trim()) {
              console.log('Contact Details cannot be empty\n');
              return patientMenu();
            }
            const newId = generatePatientId();
            const newPatient = {
              id: newId,
              name: name.trim(),
              gender: gender.trim(),
              birth: birth.trim(),
              address: address.trim(),
              contact: contact.trim(),
              diagnoses: []
            };
            patients.push(newPatient);
            savePatients();
            console.log(`Patient added, ID: ${newId}\n`);
            patientMenu();
          });
        });
      });
    });
  });
}


// Patients view their own details
function viewOwnPatient() {
  console.log('\nView Own Patient Details ');
  if (patients.length === 0) {
    console.log('No patient data available.\n');
    return patientMenu();
  }
  rl.question('Enter your patient ID (e.g. 001): ', function(id) {
    if (!id.trim()) {
      console.log('No ID entered. Returning to patient menu.\n');
      return patientMenu();
    }
    const patient = findPatientById(id.trim());
    if (!patient) {
      console.log(`Patient ID ${id} not found.\n`);
      return patientMenu();
    }
    console.log(`\nPatient ${patient.id} Details `);
    console.log(`Name:           ${patient.name}`);
    console.log(`Gender:         ${patient.gender}`);
    console.log(`Birth Date:     ${patient.birth}`);
    console.log(`Address:        ${patient.address}`);
    console.log(`Contact Info:   ${patient.contact}`);
    console.log('Diagnoses:');
    patient.diagnoses.forEach(function(d, idx) {
      console.log(`  ${idx + 1}. Date: ${d.dateRecorded}`);
      console.log(`     Diagnosis: ${d.diagnosis}`);
      console.log(`     Doctor:    ${d.recordedBy}`);
      console.log(`     Notes:     ${d.notes}\n`);
    });
    patientMenu();
  });
}

// Patients edit their own details
function editOwnPatient() {
  console.log('\n Edit Own Patient Details ');
  if (patients.length === 0) {
    console.log('No patient data available.\n');
    return patientMenu();
  }
  rl.question('Enter your patient ID: ', function(id) {
    if (!id.trim()) {
      console.log('No ID entered. Returning to patient menu.\n');
      return patientMenu();
    }
    const patient = findPatientById(id.trim());
    if (!patient) {
     console.log(`Patient ID ${id} not found.\n`);
      return patientMenu();
    }
    console.log(`Name before: ${patient.name}`);
    rl.question('Enter new name (press Enter to skip): ', function(newName) {
      if (newName.trim()) patient.name = newName.trim();
      console.log(`Gender before: ${patient.gender}`);
      rl.question('Enter new gender (press Enter to skip): ', function(newGender) {
        if (newGender.trim()) patient.gender = newGender.trim();
        console.log(`Birth Date before: ${patient.birth}`);
        rl.question('Enter new birth date (YYYY-MM-DD, press Enter to skip): ', function(newBirth) {
          if (newBirth.trim()) patient.birth = newBirth.trim();
          console.log(`Address before: ${patient.address}`);
          rl.question('Enter new address (press Enter to skip): ', function(newAddress) {
            if (newAddress.trim()) patient.address = newAddress.trim();
            console.log(`Contact before: ${patient.contact}`);
            rl.question('Enter new contact info (press Enter to skip): ', function(newContact) {
              if (newContact.trim()) patient.contact = newContact.trim();
              savePatients();
              console.log('Patient details updated.\n');
              patientMenu();
            });
          });
        });
      });
    });
  });
}


// doctor view all patients
function viewAllPatients() {
  console.log('\nView all patient Details');
  if (patients.length === 0) {
    console.log('No patient data currently available.\n');
    return doctorMenu();
  }
  console.log('All patients：');
  patients.forEach(function(p) {
    console.log(`- ID:${p.id}, Name:${p.name}, Date of Birth: ${p.birth}`);
  });
  rl.question('View patient details by patient ID (enter to return to physician menu)::', function(id) {
    if (!id.trim()) {
      console.log('');
      return doctorMenu();
    }
    const patient = findPatientById(id.trim());
    if (!patient) {
      console.log(`ID not found ${id} \n`);
      return doctorMenu();
    }
    console.log(`\nPatients ${patient.id} Details`);
    console.log(`Name:       ${patient.name}`);
    console.log(`Gender:       ${patient.gender}`);
    console.log(`Date of Birth:   ${patient.birth}`);
    console.log(`Address:       ${patient.address}`);
    console.log(`Contact Detail:  ${patient.contact}`);
     console.log('Diagnoses:');
    patient.diagnoses.forEach(function(d, idx) {
      console.log(`  ${idx + 1}. Date:      ${d.dateRecorded}`);
      console.log(`     Diagnosis:  ${d.diagnosis}`);
      console.log(`     Doctor:     ${d.recordedBy}`);
      console.log(`     Notes:      ${d.notes}\n`);
    });

    doctorMenu();
  });
}

// Add diagnosis record for a patient
function addDiagnosis() {
  console.log('\nAdd Diagnosis Record');
  if (patients.length === 0) {
    console.log('No patient data available.\n');
    return doctorMenu();
  }
  rl.question('Enter patient ID: ', function(id) {
    if (!id.trim()) {
      console.log('No ID entered. Operation canceled.\n');
      return doctorMenu();
    }
    const patient = findPatientById(id.trim());
    if (!patient) {
      console.log(` ID not found ${id} \n`);
      return doctorMenu();
    }
    rl.question('Enter diagnosis date (YYYY-MM-DD): ', function(dateRecorded) {
      if (!dateRecorded.trim()) {
        console.log('Diagnosis date cannot be empty. Operation canceled.\n');
        return doctorMenu();
      }
      rl.question('Enter diagnosis details: ', function(diagnosis) {
        if (!diagnosis.trim()) {
          console.log('Diagnosis details cannot be empty. Operation canceled.\n');
          return doctorMenu();
        }
        rl.question('Enter doctor notes (optional, press enter to skip): ', function(notes) {
          rl.question('Enter doctor name: ', function(recordedBy) {
            if (!recordedBy.trim()) {
              console.log('Doctor name cannot be empty. Operation canceled.\n');
              return doctorMenu();
            }
            const record = {
              dateRecorded: dateRecorded.trim(),
              diagnosis: diagnosis.trim(),
              notes: notes.trim(),
              recordedBy: recordedBy.trim()
            };
            patient.diagnoses.push(record);
            savePatients();
            console.log('Diagnosis record added.\n');
            doctorMenu();
          });
        });
      });
    });
  });
}

// Exit the application
function exitProgram() {
  console.log('\nExiting application. Thank you for using the system.');
  rl.close();
  process.exit(0);
}

// Patient menu
function patientMenu() {
  console.log('\nPatient Menu ');
  console.log('1. Add Patient Details');
  console.log('2. View Patient Details');
  console.log('3. Edit Patient Details');
  console.log('4. Exit');
  rl.question('Enter option (1-4): ', function(choice) {
    switch (choice.trim()) {
      case '1':
        addPatient();
        break;
      case '2':
        viewOwnPatient();
        break;
      case '3':
        editOwnPatient();
        break;
      case '4':
        exitProgram();
        break;
      default:
        console.log('Invalid choice. Please try again.\n');
        patientMenu();
    }
  });
}

// Doctor menu
function doctorMenu() {
  console.log('\nDoctor Menu ');
  console.log('1. View All Patient Details');
  console.log('2. Add Diagnosis Record');
  console.log('3. Exit');
  rl.question('Enter option (1-3): ', function(choice) {
    switch (choice.trim()) {
      case '1':
        viewAllPatients();
        break;
      case '2':
        addDiagnosis();
        break;
      case '3':
        exitProgram();
        break;
      default:
        console.log('Invalid choice. Please try again.\n');
        doctorMenu();
    }
  });
}

// Role selection menu
function selectRole() {
  console.log('\nSelect Role');
  console.log('1. Patient');
  console.log('2. Doctor');
  rl.question('Enter option (1-2): ', function(choice) {
    switch (choice.trim()) {
      case '1':
        patientMenu();
        break;
      case '2':
        doctorMenu();
        break;
      default:
        console.log('Invalid choice. Please try again.\n');
        selectRole();
    }
  });
}

// Program entry point: start with role selection
selectRole();
