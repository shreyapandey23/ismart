import { DateValidators } from './date.validators';
import * as $ from 'jquery'
import { MyserviceService } from './../services/myservice.service';
import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-bank-detail',
  templateUrl: './bank-detail.component.html',
  styleUrls: ['./bank-detail.component.css']
})
export class BankDetailComponent implements OnInit {

  accountForm = new FormGroup({
    inputAccount: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$')
    ]),
    date: new FormControl('', [
      Validators.required,
      DateValidators.invalidFormat,
      DateValidators.futureDate
    ]),
    payment: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*')
    ]),
    category: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*')
    ]),
    description: new FormControl('', Validators.required)

  });

  profileForm = this.fb.group({
    inputAccount: ['']

  });

  get accountFormControl() {
    return this.accountForm.controls;
  }

  data: any;
  transactions = [];
  constructor(private myservice: MyserviceService, private fb: FormBuilder) {

  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    //console.warn(this.accountForm.value);
    //alert("Data saved successfuly");""

    document.getElementById("modalBox").click();
    this.success = true;
    this.paymentType = "";
    this.category = "";
    this.description = "";
    this.accountForm.markAsUntouched();
    this.accountForm.reset();


  }

  paymentType;
  category;
  description;

  success = false;
  categories: SelectItem[];
  selectedCategory: any;

  options: SelectItem[];
  selectedOptions: any;
  monthBool = false;
  optBool = false;

  categoryOptions: SelectItem[];
  selectedCategoryOptions: any;

  amountList: [];

  totalDebited = 0;

  medical = 0;
  travel = 0;
  loans = 0;
  bills = 0;
  education = 0;
  shopping = 0;
  misc = 0;



  masterCopy = [];
  ngOnInit(): void {
    this.myservice.getJSON().subscribe(data => {
      console.log(data);
      this.masterCopy = data.transactions;
      this.categories = data.categories;
      this.options = data.options;
      this.categoryOptions = data.categoryOptions;

      //this.amountList=this.transactions.map(item => Object.keys(item)[3]);
      //this.totalDebited=this.amountList.reduce((total,num)=>total+num,0);

      let count = 0;
      this.masterCopy.forEach(txn => {
        if (count < 10) {
          console.log(txn);
          this.transactions.push(txn);
          count++;
        }
        if (txn.dOrC == 'debit') {
          this.totalDebited = this.totalDebited + txn.amount;
          if (txn.category == 'Medical') {
            this.medical = this.medical + txn.amount;
          }
          else if (txn.category == 'Travel') {
            this.travel = this.travel + txn.amount;
          }
          else if (txn.category == 'Loans') {
            this.loans = this.loans + txn.amount;
          }
          else if (txn.category == 'Education') {
            this.education = this.education + txn.amount;
          }
          else if (txn.category == 'Shopping') {
            this.shopping = this.shopping + txn.amount;
          }
          else if (txn.category == 'Bills') {
            this.bills = this.bills + txn.amount;
          }
          else {
            this.misc = this.misc + txn.amount;
          }
        }
      });

      console.log(this.totalDebited);

      this.data = {
        labels: ['Medical', 'Shopping', 'Bills', 'Loans', 'Education', 'Travel', 'Misc'],
        datasets: [
          {
            data: [this.medical, this.shopping, this.bills, this.loans, this.education, this.travel, this.misc],
            backgroundColor: [
              "#333333",
              "#ffff00",
              "#00ff00",
              "#0000ff",
              "#ff00ff",
              "#ff0000",
              "#00ffff"
            ]
          }]
      };
    });

  }

  getLastXMonths(x) {
    let temp = [];
    let date2 = new Date();
    date2.setMonth(date2.getMonth() - x);
    this.masterCopy.forEach(txn => {
      let strDate = txn.date.split("/");
      let date = new Date(strDate[2] + "-" + strDate[1] + "-" + strDate[0]);

      if (date > date2) {
        temp.push(txn);
      }
    });

    this.transactions = [];

    for (let i = 0; i < temp.length; i++) {
      this.transactions.push(temp[i]);
    }
  }

  backUpTrans = [];
  filterByCategory(cat) {

    let temp = [];
    if (cat == "all") {
      this.transactions = [];

      for (let i = 0; i < this.backUpTrans.length; i++) {
        this.transactions.push(this.backUpTrans[i]);
      }

      return;
    }
    this.transactions.forEach(txn => {

      if (cat == "misc") {
        if (!['medical', 'loans', 'bills', 'education', 'travel', 'shopping'].includes(txn.category.toLowerCase())) {
          temp.push(txn);
        }
      }
      else {
        if (txn.category.toLowerCase() == cat) {
          temp.push(txn);
        }
      }

    });

    this.backUpTrans = [];
    for (let i = 0; i < this.transactions.length; i++) {
      this.backUpTrans.push(this.transactions[i]);
    }

    this.transactions = [];

    for (let i = 0; i < temp.length; i++) {
      this.transactions.push(temp[i]);
    }
  }

  getMonthwise(month, year) {
    let temp = [];
    let date2 = new Date();

    date2.setMonth(month);
    date2.setFullYear(year);
    this.masterCopy.forEach(txn => {
      let strDate = txn.date.split("/");
      let date = new Date(strDate[2] + "-" + strDate[1] + "-" + strDate[0]);

      if ((date.getMonth() + 1) == date2.getMonth() && date.getFullYear() == date2.getFullYear()) {
        temp.push(txn);
      }
    });

    this.transactions = [];

    for (let i = 0; i < temp.length; i++) {
      this.transactions.push(temp[i]);
    }
  }

  FrequencyChanged(e) {
    console.log(e.value);
    console.log("Inside")
    if (e.value == 'monthly') {
      this.monthBool = true;
      this.getLastXMonths(6);
    }
    else {
      this.transactions = [];
      let count = 0;
      for (let i = 0; i < this.masterCopy.length; i++) {
        if (count < 10) {
          this.transactions.push(this.masterCopy[i]);
          count++;
        }

      }
      this.monthBool = false;
    }
  }

  optionsChanged(e) {
    if (e.value == 'month') {
      this.optBool = true;
    }
    else {
      if (e.value == 'lThree') {
        this.getLastXMonths(3);
      }
      else {
        this.getLastXMonths(6);
      }
      this.optBool = false;
    }
  }

  inputMonthYear;
  monthChangeEvent(e) {
    this.getMonthwise(this.inputMonthYear.split("-")[1], this.inputMonthYear.split("-")[0])
  }

  categorySelected(e) {
    console.log(e.value);
    this.filterByCategory(e.value.toLowerCase());
  }

}
