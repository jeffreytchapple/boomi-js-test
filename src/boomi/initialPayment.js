// src/boomi/initialPayment.js

// defensive: treat inputs as strings
var initial = (InitialAmount !== null && InitialAmount !== undefined) ? String(InitialAmount).trim() : null;
var recurring = (RecurringAmount !== null && RecurringAmount !== undefined) ? String(RecurringAmount).trim() : null;

if (initial && recurring) {
  var initialNumeric = Number(initial.replace(/,/g, ""));
  var recurringNumeric = Number(recurring.replace(/,/g, ""));

  if (!isNaN(initialNumeric) && !isNaN(recurringNumeric)) {
    if (initialNumeric !== recurringNumeric) {
      InstallmentInitialDeposit = initial;
    }
  } else {
    if (initial !== recurring) {
      InstallmentInitialDeposit = initial;
    }
  }
}
