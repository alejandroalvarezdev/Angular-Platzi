import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EmpleyeeService } from 'src/app/services/empleyee.service';
import { FeedBackService } from 'src/app/services/feed-back.service';
import { environment } from 'src/environments/environment.prod';
@Component({
  selector: 'app-autocompletev2',
  templateUrl: './autocompletev2.component.html',
  styleUrls: ['./autocompletev2.component.css']
})
export class Autocompletev2Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  employees: any;
  filteredOptionsApplicantsNameId: Observable<any[]>;
  filteredOptionsInnmediateBoss: Observable<any[]>;
  aplicantsNameId: string;
  innmediateBossId: string;
  developments: Array<any>;
  activities: Array<any>;
  avoids: Array<any>;
  feedBackRequest: any;
  date: string;
  reviewDate: string;
  feedBacks: any;
  numberBeforeincrementString: string;
  numberBefore: number = 0;
  idFeddBack: string;
  feedBackById: any;
  sendFeedBack: Subject<void> = new Subject<void>();
  eventEnableForm: Subject<void> = new Subject<void>();
  flagButton: boolean = false;
  flagSpinner: boolean = true;
  horizontalPosition: MatSnackBarHorizontalPosition = 'left';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  durationInSeconds = 4;
  flagQ1: boolean = false;
  flagQ2: boolean = false;
  flagQ3: boolean = false;
  flagQ4: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _employeesApi: EmpleyeeService,
    private _feedBackService: FeedBackService,
    private _activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private _router: Router,
    public dialog: MatDialog
  ) {}
  user: any;
  token: any;
  role: any;
  userAdmin: any;
  tokenAdmin: any;
  feedBackByIdArry = [];
  ngOnInit(): void {
    this.user = sessionStorage.getItem('user');
    this.token = sessionStorage.getItem('token');
    this.role = sessionStorage.getItem('role');
    this.userAdmin = environment.userAdmin;
    // this.tokenAdmin = sessionStorage.getItem('tokenAdmin');
    this._activatedRoute.paramMap.subscribe((params) => {
      this.idFeddBack = params.get('id');
    });
    console.warn(this.idFeddBack);
    this._employeesApi
      .getEmpleyes(this.userAdmin, this.token)
      .subscribe((resp) => {
        this.employees = resp;
        // console.warn({ Empleados: this.employees });
        this.autoCompleteFieldAplicantsName();
        this.autoCompleteFieldInnmediateBoss();
        this._feedBackService
          .getFeedBacks(this.userAdmin, this.token)
          .subscribe((resp) => {
            this.feedBacks = resp.retroalimentacion;

            console.warn('FeedBacks', this.feedBacks);
            if (this.feedBacks !== undefined) {
              this.feedBacks.forEach((feedback) => {
                let employeeID = sessionStorage.getItem('idEmployee');
                if (employeeID == feedback['Employee1.ID']) {
                  this.feedBackByIdArry.push(feedback);
                }
              });
            }
            console.warn('FeedBacksID', this.feedBackByIdArry);

            this.reqIdGenerate();
            this.formatDate();
            this.flagSpinner = false;
            if (this.idFeddBack == null) {
            } else {
              this.feedBackForm.disable();
              this._feedBackService
                .getFeedBackById(this.idFeddBack, this.userAdmin, this.token)
                .subscribe((resp) => {
                  this.feedBackById = resp.response.result;
                  this.setValues(this.feedBackById);
                  this.sendFeedBackById(this.feedBackById);
                  this.flagSpinner = false;
                });
            }
          });
      });
  }

  feedBackForm: FormGroup = this._formBuilder.group({
    applicantsName: ['', Validators.required],
    date: [''],
    nameImmediateBoss: ['', Validators.required],
    feedBackNumber: [''],
    reviewDate: ['', Validators.required],
    resultQ1: [''],
    resultQ2: [''],
    resultQ3: [''],
    resultQ4: [''],
    trimester: ['', Validators.required],
    total: [''],
  });

  guardar() {
    this.feedBackForm.controls['feedBackNumber'].enable();
    this.feedBackForm.controls['date'].enable();
    this.feedBackForm.controls['resultQ1'].enable();
    this.feedBackForm.controls['resultQ2'].enable();
    this.feedBackForm.controls['resultQ3'].enable();
    this.feedBackForm.controls['resultQ4'].enable();
    this.feedBackForm.controls['total'].enable();
    this.feedBackForm.controls['trimester'].enable();

    let {
      date,
      reviewDate,
      feedBackNumber,
      resultQ1,
      resultQ2,
      resultQ3,
      resultQ4,
      trimester,
    } = this.feedBackForm.value;

    //Total
    console.warn(this.feedBackForm.controls['trimester'].value);
    let feedTotal;

    if (this.feedBackForm.controls['trimester'].value == '1') {
      // if(resultQ1 == "" || resultQ1 == undefined){
      //   this.feedBackForm.controls['total'].disable();
      // }
      // if(resultQ1 == undefined || resultQ1 == ""){
      //   resultQ1 = '';
      //   console.warn('field mandatory');
      //   this.feedBackForm.controls['total'].disable();
      //   this.openSnackBarFailedResult()
      //   return
      // }
      if (this.feedBackForm.controls['resultQ1'].value !== '') {
        feedTotal = Number(this.feedBackForm.controls['resultQ1'].value);
      }
    }

    if (this.feedBackForm.controls['trimester'].value == '2') {
      // if(resultQ2 == undefined || resultQ2 == ""){
      //   resultQ2 = '';
      //   console.warn('field mandatory');
      //   this.feedBackForm.controls['resultQ1'].disable();
      //   this.feedBackForm.controls['total'].disable();
      //   this.openSnackBarFailedResult()
      //   return
      // }
      if (
        this.feedBackForm.controls['resultQ1'].value == '' ||
        this.feedBackForm.controls['resultQ1'].value == undefined
      ) {
        feedTotal = Number(this.feedBackForm.controls['resultQ2'].value);
      } else {
        feedTotal =
          Number(this.feedBackForm.controls['resultQ1'].value) +
          Number(this.feedBackForm.controls['resultQ2'].value);
      }
    }

    if (this.feedBackForm.controls['trimester'].value == '3') {
      // if(resultQ3 == undefined || resultQ3 == ""){
      //   resultQ3 = '';
      //   console.warn('field mandatory');
      //   this.feedBackForm.controls['resultQ1'].disable();
      //   this.feedBackForm.controls['resultQ2'].disable();
      //   this.feedBackForm.controls['total'].disable();
      //   this.openSnackBarFailedResult()
      //   return
      // }
      if (
        (this.feedBackForm.controls['resultQ1'].value == '' ||
          this.feedBackForm.controls['resultQ1'].value == undefined) &&
        (this.feedBackForm.controls['resultQ2'].value == '' ||
          this.feedBackForm.controls['resultQ2'].value == undefined) &&
        (this.feedBackForm.controls['resultQ4'].value == '' ||
          this.feedBackForm.controls['resultQ4'].value == undefined)
      ) {
        feedTotal = Number(this.feedBackForm.controls['resultQ3'].value);
      }

      if (
        (this.feedBackForm.controls['resultQ1'].value !== '' ||
          this.feedBackForm.controls['resultQ1'].value == undefined) &&
        (this.feedBackForm.controls['resultQ2'].value !== '' ||
          this.feedBackForm.controls['resultQ2'].value == undefined)
        // (this.feedBackForm.controls['resultQ4'].value !== '' ||
        //   this.feedBackForm.controls['resultQ4'].value == undefined)
      ) {
        feedTotal =
          Number(this.feedBackForm.controls['resultQ3'].value) +
          Number(this.feedBackForm.controls['resultQ2'].value) +
          Number(this.feedBackForm.controls['resultQ1'].value);
      }

      if (
        (this.feedBackForm.controls['resultQ1'].value == '' ||
          this.feedBackForm.controls['resultQ1'].value == undefined) &&
        this.feedBackForm.controls['resultQ2'].value !== ''
      ) {
        feedTotal =
          Number(this.feedBackForm.controls['resultQ3'].value) +
          Number(this.feedBackForm.controls['resultQ2'].value);
      }

      if (
        this.feedBackForm.controls['resultQ1'].value !== '' &&
        (this.feedBackForm.controls['resultQ2'].value == '' ||
          this.feedBackForm.controls['resultQ2'].value == undefined)
      ) {
        feedTotal =
          Number(this.feedBackForm.controls['resultQ1'].value) +
          Number(this.feedBackForm.controls['resultQ3'].value);
      }

      if (
        this.feedBackForm.controls['resultQ1'].value == undefined &&
        this.feedBackForm.controls['resultQ2'].value == undefined &&
        this.feedBackForm.controls['resultQ4'].value == ''
      ) {
        feedTotal = Number(this.feedBackForm.controls['resultQ3'].value);
      }
    }

    if (this.feedBackForm.controls['trimester'].value == '4') {
      // if(resultQ4 == undefined || resultQ4 == ""){
      //   resultQ4 = '';
      //   console.warn('field mandatory');
      //   this.feedBackForm.controls['resultQ1'].disable();
      //   this.feedBackForm.controls['resultQ2'].disable();
      //   this.feedBackForm.controls['resultQ3'].disable();
      //   this.feedBackForm.controls['total'].disable();

      //   this.openSnackBarFailedResult()
      //   return
      // }
      if (
        this.feedBackForm.controls['resultQ1'].value !== '' &&
        this.feedBackForm.controls['resultQ2'].value !== '' &&
        this.feedBackForm.controls['resultQ3'].value !== ''
      ) {
        feedTotal =
          Number(this.feedBackForm.controls['resultQ1'].value) +
          Number(this.feedBackForm.controls['resultQ2'].value) +
          Number(this.feedBackForm.controls['resultQ3'].value) +
          Number(this.feedBackForm.controls['resultQ4'].value);
      }

      if (
        (this.feedBackForm.controls['resultQ1'].value == '' ||
          this.feedBackForm.controls['resultQ1'].value == undefined) &&
        (this.feedBackForm.controls['resultQ2'].value == '' ||
          this.feedBackForm.controls['resultQ2'].value == undefined) &&
        (this.feedBackForm.controls['resultQ3'].value == '' ||
          this.feedBackForm.controls['resultQ3'].value == undefined)
      ) {
        feedTotal = Number(this.feedBackForm.controls['resultQ4'].value);
      }

      if (
        (this.feedBackForm.controls['resultQ1'].value == '' ||
          this.feedBackForm.controls['resultQ1'].value == '') &&
        (this.feedBackForm.controls['resultQ2'].value == '' ||
          this.feedBackForm.controls['resultQ2'].value == undefined)
      ) {
        feedTotal =
          Number(this.feedBackForm.controls['resultQ3'].value) +
          Number(this.feedBackForm.controls['resultQ4'].value);
      }

      if (
        (this.feedBackForm.controls['resultQ1'].value == '' ||
          this.feedBackForm.controls['resultQ1'].value == undefined) &&
        (this.feedBackForm.controls['resultQ3'].value == '' ||
          this.feedBackForm.controls['resultQ3'].value == undefined)
      ) {
        feedTotal =
          Number(this.feedBackForm.controls['resultQ2'].value) +
          Number(this.feedBackForm.controls['resultQ4'].value);
      }
      if (
        (this.feedBackForm.controls['resultQ2'].value == '' ||
          this.feedBackForm.controls['resultQ2'].value == undefined) &&
        (this.feedBackForm.controls['resultQ3'].value == '' ||
          this.feedBackForm.controls['resultQ3'].value == undefined)
      ) {
        feedTotal =
          Number(this.feedBackForm.controls['resultQ1'].value) +
          Number(this.feedBackForm.controls['resultQ4'].value);
      }
      if (
        this.feedBackForm.controls['resultQ1'].value == undefined &&
        this.feedBackForm.controls['resultQ2'].value == undefined &&
        this.feedBackForm.controls['resultQ3'].value == undefined
      ) {
        feedTotal = Number(this.feedBackForm.controls['resultQ4'].value);
      }

      if (
        this.feedBackForm.controls['resultQ1'].value == '' &&
        this.feedBackForm.controls['resultQ2'].value !== '' &&
        this.feedBackForm.controls['resultQ3'].value !== ''
      ) {
        feedTotal =
          Number(this.feedBackForm.controls['resultQ2'].value) +
          Number(this.feedBackForm.controls['resultQ3'].value) +
          Number(this.feedBackForm.controls['resultQ4'].value);
      }
    }

    console.warn(this.feedBackByIdArry.length);
    if (this.idFeddBack == null) {
      feedTotal = feedTotal / (this.feedBackByIdArry.length + 1);
      feedTotal = Math.round(feedTotal);
    } else {
      if (this.feedBackById[0].Trimester == '1') {
        feedTotal = this.feedBackForm.controls['resultQ1'].value;
      }
      if (this.feedBackById[0].Trimester == '2') {
        feedTotal =
          (Number(this.feedBackById[0].Result_Q1) +
            Number(this.feedBackForm.controls['resultQ2'].value) +
            Number(this.feedBackById[0].Result_Q3) +
            Number(this.feedBackById[0].Result_Q4)) /
          this.feedBackByIdArry.length;
      }
      if (this.feedBackById[0].Trimester == '3') {
        feedTotal =
          (Number(this.feedBackById[0].Result_Q1) +
            Number(this.feedBackById[0].Result_Q2) +
            Number(this.feedBackForm.controls['resultQ3'].value) +
            Number(this.feedBackById[0].Result_Q4)) /
          this.feedBackByIdArry.length;
      }

      if (this.feedBackById[0].Trimester == '4') {
        feedTotal =
          (Number(this.feedBackById[0].Result_Q1) +
            Number(this.feedBackById[0].Result_Q2) +
            Number(this.feedBackById[0].Result_Q3) +
            Number(this.feedBackForm.controls['resultQ4'].value)) /
          this.feedBackByIdArry.length;
      }
      feedTotal = Math.round(feedTotal);
    }

    //ReviewDate
    let reviewDateClean;
    if (reviewDate == '') {
    } else {
      let month = reviewDate.getMonth() + 1;
      let monthEnglish = new Intl.DateTimeFormat('en-US', {
        month: 'short',
      }).format(reviewDate);
      this.reviewDate = `${reviewDate.getDate()}-${monthEnglish}-${reviewDate.getFullYear()}`;
      reviewDateClean = this.reviewDate;
    }

    ////////////////////////////

    //feedback section 1
    let strengths = [];
    let developmentNeeds = [];
    this.developments.forEach((element) => {
      strengths.push(element.strengths);
      developmentNeeds.push(element.development);
    });

    //feedback section 2
    let descriptions = [];
    let deadLines = [];
    this.activities.forEach((element) => {
      descriptions.push(element.description);
      let fullDate = element.deadline;
      let deadlines = new Date(fullDate);

      let month = deadlines.getMonth() + 1;
      let monthEnglish;
      console.warn(month);
      console.warn(monthEnglish);

      monthEnglish = new Intl.DateTimeFormat('en-US', {
        month: 'short',
      }).format(deadlines);

      let deadLineClean = `${deadlines.getDate()}-${monthEnglish}-${deadlines.getFullYear()}`;
      deadLines.push(deadLineClean);
    });

    //feedback section 3
    let avoids = [];
    let numbers = [];
    let no = 0;
    this.avoids.forEach((element) => {
      avoids.push(element.avoid);
      numbers.push((no = no + 1).toString());
    });

    //////////////////////////////////

    ///Validaciones
    if (reviewDateClean === undefined) {
      reviewDateClean = '';
    }

    let stringNumber;
    if (this.idFeddBack == null) {
      stringNumber = this.numberBeforeincrementString;
    } else {
      stringNumber = feedBackNumber;
    }

    let dateClean;
    if (this.idFeddBack == null) {
      dateClean = this.date;
    } else {
      dateClean = date;
    }

    if (this.aplicantsNameId === undefined || this.aplicantsNameId === '') {
      console.warn('failed', this.aplicantsNameId);
      this.openSnackBarFailedName();
      this.feedBackForm.controls['feedBackNumber'].disable();
      this.feedBackForm.controls['date'].disable();
      return;
    }

    if (this.innmediateBossId === undefined || this.innmediateBossId === '') {
      console.warn('failed', this.innmediateBossId);
      this.openSnackBarFailedLeaderName();
      this.feedBackForm.controls['feedBackNumber'].disable();
      this.feedBackForm.controls['date'].disable();
      return;
    }

    if (this.developments.length < 3) {
      this.openSnackBarFailedDevelopment();
      this.feedBackForm.controls['total'].disable();
      this.feedBackForm.controls['feedBackNumber'].disable();
      this.feedBackForm.controls['date'].disable();
      return;
    }

    if (this.activities.length < 2) {
      this.openSnackBarFailedDescriptions();
      this.feedBackForm.controls['total'].disable();
      this.feedBackForm.controls['feedBackNumber'].disable();
      this.feedBackForm.controls['date'].disable();
      return;
    }

    if (this.avoids.length < 1) {
      this.openSnackBarFailedAvoids();
      this.feedBackForm.controls['total'].disable();
      this.feedBackForm.controls['feedBackNumber'].disable();
      this.feedBackForm.controls['date'].disable();
      return;
    }

    console.warn(resultQ1);
    console.warn(resultQ2);
    console.warn(resultQ3);
    console.warn(resultQ4);

    if (resultQ1 <= -1 || resultQ1 >= 101) {
      this.openSnackBarFailedResul();
      this.feedBackForm.controls['feedBackNumber'].disable();
      this.feedBackForm.controls['date'].disable();
      this.feedBackForm.controls['total'].disable();
      return;
    }
    if (resultQ2 <= -1 || resultQ2 >= 101) {
      this.openSnackBarFailedResul();
      this.feedBackForm.controls['feedBackNumber'].disable();
      this.feedBackForm.controls['date'].disable();
      this.feedBackForm.controls['total'].disable();
      return;
    }
    if (resultQ3 <= -1 || resultQ3 >= 101) {
      this.openSnackBarFailedResul();
      this.feedBackForm.controls['feedBackNumber'].disable();
      this.feedBackForm.controls['date'].disable();
      this.feedBackForm.controls['total'].disable();
      return;
    }
    if (resultQ4 <= -1 || resultQ4 >= 101) {
      this.openSnackBarFailedResul();
      this.feedBackForm.controls['feedBackNumber'].disable();
      this.feedBackForm.controls['date'].disable();
      this.feedBackForm.controls['total'].disable();
      return;
    }

    if(trimester == "" || trimester == undefined){
      this.feedBackForm.controls['feedBackNumber'].disable();
      this.feedBackForm.controls['date'].disable();
      this.feedBackForm.controls['total'].disable();
      this.openSnackBarFailedTrimester()
      return;
    }

    if(resultQ1 == "" || resultQ1 == undefined){
      resultQ1 = ""
    }
    if(resultQ2 == "" || resultQ2 == undefined){
      resultQ2 = ""
    }
    if(resultQ3 == "" || resultQ3 == undefined){
      resultQ3 = ""
    }
    if(resultQ4 == "" || resultQ4 == undefined){
      resultQ4 = ""
    }

    /////////////////////////////

    //////Request
    this.feedBackRequest = {
      feedBackRequest: {
        Employee1: this.aplicantsNameId,
        Leader_name: this.innmediateBossId,
        Date: dateClean,
        Review_Date: reviewDateClean,
        Feed_Back_id: stringNumber,
        Result_Q1: resultQ1.toString(),
        Result_Q2: resultQ2.toString(),
        Result_Q3: resultQ3.toString(),
        Result_Q4: resultQ4.toString(),
        Strengths: strengths,
        Development_needs: developmentNeeds,
        Description: descriptions,
        Deadline: deadLines,
        No: numbers,
        Avoid: avoids,
        Trimester: trimester,
        Total: feedTotal.toString(),
      },
      queryModule: 'Feed_Back',
      idRegistro: this.idFeddBack,
      tokenRequest: {
        username: this.user,
        zohoModule: 'people',
        enviroment: environment.enviroment,
      },
    };

    console.warn('feed back request', this.feedBackRequest);

    ///// Save
    if (this.idFeddBack == null) {
      this._feedBackService
        .postFeedBack(this.feedBackRequest, this.token)
        .subscribe(
          (resp) => {
            console.log('response', resp);
            if (resp.response.message == 'Error occurred') {
              this.openSnackBarFailed();
            } else {
              // this.openSnackBarSuccess();
              this.openDialog()
              this._router.navigateByUrl(`protected/main/home`);
            }
          },
          (err) => {
            console.error(err);
            this.openSnackBarFailed();
          }
        );
    } else {
      this._feedBackService
        .udpdateFeedBack(this.feedBackRequest, this.token)
        .subscribe((resp) => {
          console.warn(resp);
          if (resp.response.message == 'Error occurred') {
            this.openSnackBarFailedUpdated();
          } else {
            this.openSnackBarSuccessUpdated();
          }
        }),
        (err) => {
          console.warn('err', err);
          this.openSnackBarFailedUpdated();
        };
    }
  }

  openDialog() {
    this.dialog.open(DialogSuccessfulFeed);
  }

  setValues(feedBackById) {
    console.warn(feedBackById);
    let date = feedBackById[0].Review_Date;
    date = new Date(date);

    if (feedBackById[0].Result_Q1 !== '') {
      this.flagQ1 = true;
    }
    if (feedBackById[0].Result_Q2 !== '') {
      this.flagQ2 = true;
    }
    if (feedBackById[0].Result_Q3 !== '') {
      this.flagQ3 = true;
    }
    if (feedBackById[0].Result_Q4 !== '') {
      this.flagQ4 = true;
    }

    this.feedBackForm.patchValue({
      applicantsName: feedBackById[0].Employee1,
      date: feedBackById[0].Date,
      nameImmediateBoss: feedBackById[0].Leader_name,
      feedBackNumber: feedBackById[0].Feed_Back_id,
      reviewDate: date,
      resultQ1: feedBackById[0].Result_Q1,
      resultQ2: feedBackById[0].Result_Q2,
      resultQ3: feedBackById[0].Result_Q3,
      resultQ4: feedBackById[0].Result_Q4,
      total: feedBackById[0].Total,
      trimester: feedBackById[0].Trimester,
    });

    this.aplicantsNameId = feedBackById[0]['Employee1.ID'];
    this.innmediateBossId = feedBackById[0]['Leader_name.ID'];
  }

  //autoCompletes
  autoCompleteFieldAplicantsName() {
    this.filteredOptionsApplicantsNameId = this.feedBackForm.controls[
      'applicantsName'
    ].valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value)),
      map((name) => (name ? this._filter1(name) : this.employees.slice()))
    );
  }
  autoCompleteFieldInnmediateBoss() {
    this.filteredOptionsInnmediateBoss = this.feedBackForm.controls[
      'nameImmediateBoss'
    ].valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value)),
      map((name) => (name ? this._filter2(name) : this.employees.slice()))
    );
  }
  private _filter1(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.employees.filter((option) =>
      option.FirstName.toLowerCase().includes(filterValue)
    );
  }
  private _filter2(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.employees.filter((option) =>
      option.FirstName.toLowerCase().includes(filterValue)
    );
  }
  displayFnAplicantsName(user: any): any {
    // console.warn({ user: user });
    return user;
  }
  displayFnInmediateBoss(user: any): any {
    // console.warn({ user: user });
    return user;
  }
  /////

  formatDate() {
    let today = new Date();
    let month = today.getMonth() + 1;
    let monthEnglish = new Intl.DateTimeFormat('en-US', {
      month: 'short',
    }).format(today);
    this.date = `${today.getDate()}-${monthEnglish}-${today.getFullYear()}`;
    this.feedBackForm.patchValue({
      date: [this.date],
    });
    this.feedBackForm.controls['date'].disable();
  }

  onDate(event) {
    console.warn(event);
  }

  reqIdGenerate() {
    if (this.feedBacks == undefined) {
      this.numberBeforeincrementString = 'FEED-1';
      this.feedBackForm.patchValue({
        feedBackNumber: this.numberBeforeincrementString,
      });
    } else {
      this.feedBacks.forEach((element) => {
        let number;
        let requsitionSplit = element.Feed_Back_id;
        requsitionSplit = requsitionSplit.split('-');
        let requsitionSplitNumber = requsitionSplit[1];
        number = Number(requsitionSplitNumber);
        if (this.numberBefore <= number) {
          this.numberBefore = number;
        }
      });
      this.numberBeforeincrementString = `FEED-${this.numberBefore + 1}`;
      this.feedBackForm.patchValue({
        feedBackNumber: [this.numberBeforeincrementString],
      });
    }
    this.feedBackForm.controls['feedBackNumber'].disable();
  }

  sendFeedBackById(feedBackById: any) {
    this.emitSendFeedBack(feedBackById);
  }

  emitSendFeedBack(feedBackById: void) {
    this.sendFeedBack.next(feedBackById);
  }

  enableForm() {
    console.warn('ENABLE!!');
    this.feedBackForm.enable();
    this.flagButton = true;
    this.emitEventEnable();
    this.feedBackForm.controls['feedBackNumber'].disable();
    this.feedBackForm.controls['date'].disable();
    this.feedBackForm.controls['total'].disable();
    this.feedBackForm.controls['trimester'].disable();
    console.warn('ByID', this.feedBackById);
    console.warn('Feedbacks', this.feedBackByIdArry);

    if (this.feedBackById[0].Trimester == '1') {
      this.feedBackByIdArry.forEach((element) => {
        console.warn(element.Trimester);
        if (element.Trimester == '2') {
          this.feedBackForm.controls['resultQ1'].disable();
          return;
        }
      });
    }
    if (this.feedBackById[0].Trimester == '2') {
      for (const element of this.feedBackByIdArry) {
        if (element.Trimester === '3') {
          console.warn('entro if');
          this.feedBackForm.controls['resultQ1'].disable();
          this.feedBackForm.controls['resultQ2'].disable();
          return;
        } else {
          this.feedBackForm.controls['resultQ1'].disable();
          this.feedBackForm.controls['resultQ2'].enable();
        }
      }
    }
    if (this.feedBackById[0].Trimester == '3') {
      for (const element of this.feedBackByIdArry) {
        if (element.Trimester === '4') {
          console.warn('entro if');
          this.feedBackForm.controls['resultQ1'].disable();
          this.feedBackForm.controls['resultQ2'].disable();
          this.feedBackForm.controls['resultQ3'].disable();
          return;
        } else {
          this.feedBackForm.controls['resultQ1'].disable();
          this.feedBackForm.controls['resultQ2'].disable();
          this.feedBackForm.controls['resultQ3'].enable();
        }
      }
    }
    if (this.feedBackById[0].Trimester == '4') {
      for (const element of this.feedBackByIdArry) {
        if (element.Trimester === '4') {
          console.warn('entro if');
          this.feedBackForm.controls['resultQ1'].disable();
          this.feedBackForm.controls['resultQ2'].disable();
          this.feedBackForm.controls['resultQ3'].disable();
          this.feedBackForm.controls['resultQ4'].enable();
          return;
        }
      }
    }
  }

  emitEventEnable() {
    this.eventEnableForm.next();
  }

  openSnackBarSuccess() {
    let mySnack = this._snackBar.open('', 'Record saved', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSeconds * 1000,
    });
    mySnack.afterDismissed().subscribe(() => {
      // console.log('CERRADOO');
      this._router.navigateByUrl(`protected/main/feedBackList`);
    });
  }

  openSnackBarFailedUpdated() {
    this._snackBar.open('Check the fields', 'Edition failed', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSeconds * 1000,
    });
  }

  openSnackBarSuccessUpdated() {
    let mySnack = this._snackBar.open('', 'Edition saved', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSeconds * 1000,
    });
    mySnack.afterDismissed().subscribe(() => {
      // console.log('CERRADOO');
      this._router.navigateByUrl(`protected/main/feedBackList`);
    });
  }

  openSnackBarFailed() {
    this._snackBar.open('Check the fields', 'Record failed', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSeconds * 1000,
    });
  }

  openSnackBarFailedDevelopment() {
    this._snackBar.open(
      "The Development needs section must be 3 or more",
      '',
      {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: this.durationInSeconds * 1000,
      }
    );
  }

  openSnackBarFailedDescriptions() {
    this._snackBar.open(
      "The Descriptions section must be 2 or more",
      '',
      {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: this.durationInSeconds * 1000,
      }
    );
  }

  openSnackBarFailedAvoids() {
    this._snackBar.open("The Avoids section must be 1 or more", '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSeconds * 1000,
    });
  }

  longDuration = 3;
  openSnackBarFailedName() {
    this._snackBar.open(
      'Check the fields',
      'Please select your NAME from the drop down list',
      {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: this.longDuration * 1000,
      }
    );
  }

  openSnackBarFailedLeaderName() {
    this._snackBar.open(
      'Check the fields',
      'Please select LEADER NAME from the drop down list',
      {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: this.longDuration * 1000,
      }
    );
  }

  openSnackBarFailedResul() {
    this._snackBar.open('Check the fields Result', 'The range value is 0 to 100', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.longDuration * 1000,
    });
  }

  openSnackBarFailedTrimester() {
    this._snackBar.open('Check the fields TRIMESTER', 'The field is mandatory', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.longDuration * 1000,
    });
  }

  openSnackBarFailedResult() {
    this._snackBar.open('Check the fields RESULT', 'The field must not be empty', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.longDuration * 1000,
    });
  }

  numberTrimester(event?: any) {
    let trimester = event.value;
    let employeeID;
    let resultQ1;
    let resultQ2;
    let resultQ3;
    let total = 0;
    if (trimester == '1') {
      this.flagQ1 = true;
      this.flagQ2 = false;
      this.flagQ3 = false;
      this.flagQ4 = false;
      this.feedBackForm.controls['resultQ1'].enable();
      this.feedBackForm.controls['total'].disable();
    }
    if (trimester == '2') {
      this.flagQ1 = true;
      this.flagQ2 = true;
      this.flagQ3 = false;
      this.flagQ4 = false;

      this.feedBackByIdArry.forEach((feedback) => {
        if (feedback.Trimester == '1') {
          resultQ1 = feedback.Result_Q1;
          total = feedback.Result_Q1;
        }
      });

      this.feedBackForm.patchValue({
        resultQ1: resultQ1,
        total: total.toString(),
      });

      this.feedBackForm.controls['resultQ1'].disable();
      this.feedBackForm.controls['resultQ2'].enable();
      this.feedBackForm.controls['total'].disable();
    }
    if (trimester == '3') {
      this.flagQ1 = true;
      this.flagQ2 = true;
      this.flagQ3 = true;
      this.flagQ4 = false;

      this.feedBackByIdArry.forEach((feedback) => {
        if (feedback.Trimester == '2') {
          resultQ1 = feedback.Result_Q1;
          resultQ2 = feedback.Result_Q2;
          total =
            (Number(feedback.Result_Q1) + Number(feedback.Result_Q2)) /
            this.feedBackByIdArry.length;
        }
      });
      this.feedBackForm.patchValue({
        resultQ1: resultQ1,
        resultQ2: resultQ2,
        total: total.toString(),
      });

      this.feedBackForm.controls['resultQ1'].disable();
      this.feedBackForm.controls['resultQ2'].disable();
      this.feedBackForm.controls['resultQ3'].enable();
      this.feedBackForm.controls['total'].disable();
    }
    if (trimester == '4') {
      this.flagQ1 = true;
      this.flagQ2 = true;
      this.flagQ3 = true;
      this.flagQ4 = true;

      this.feedBackByIdArry.forEach((feedback) => {
        if (feedback.Trimester == '3') {
          resultQ1 = feedback.Result_Q1;
          resultQ2 = feedback.Result_Q2;
          resultQ3 = feedback.Result_Q3;
          total =
            (Number(feedback.Result_Q1) +
              Number(feedback.Result_Q2) +
              Number(feedback.Result_Q3)) /
            this.feedBackByIdArry.length;
        }
      });
      this.feedBackForm.patchValue({
        resultQ1: resultQ1,
        resultQ2: resultQ2,
        resultQ3: resultQ3,
        total: total,
      });

      this.feedBackForm.controls['resultQ1'].disable();
      this.feedBackForm.controls['resultQ2'].disable();
      this.feedBackForm.controls['resultQ3'].disable();
      this.feedBackForm.controls['resultQ4'].enable();
      this.feedBackForm.controls['total'].disable();
    }
  }

  getaplicantsNameId(event) {
    this.aplicantsNameId = event.option.id;
    // console.warn({ aplicantsNameID: this.aplicantsNameId });
  }

  getInnmediateBossId(event) {
    this.innmediateBossId = event.option.id;
    // console.warn({ InmmediatebossId: this.innmediateBossId });
  }

  getDevelopment(values: any) {
    // console.warn('from padre values', values);
    this.developments = values;
  }

  getActivity(values: any) {
    // console.warn('from padre values', values);
    this.activities = values;
  }

  getAvoid(values: any) {
    // console.warn('from padre values', values);
    this.avoids = values;
  }

  errors(form: FormGroup, controlName: string): string {
    if (form.controls[controlName].touched) {
      if (form.controls[controlName].hasError('required'))
        return 'This field is mandatory';
    }
  }

  errorsNumber(form: FormGroup, controlName: string): string {
    if (form.controls[controlName].touched) {
      if (
        form.controls[controlName].hasError('min') ||
        form.controls[controlName].hasError('max')
      ) {
        return 'The range value is 0 to 100';
      }
    }
  }
}

@Component({
  selector: 'dialog-successful',
  templateUrl: './dialog-successful-feed.html',
})
export class DialogSuccessfulFeed implements OnInit {
  constructor(private _router: Router) {}
  ngOnInit(): void {
    console.warn('Abrio suuses');
  }

  // close() {
  //   this._router.navigateByUrl(`protected/main/home`);
  // }

  goZoho() {
    window.location.href =
      'https://people.zoho.com/720722449/zp#performance/form/listview-formId:610005000005557247/viewId:610005000005557249';
  }
}

