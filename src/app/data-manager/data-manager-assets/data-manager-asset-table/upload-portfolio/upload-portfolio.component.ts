import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadDataService } from 'app/shared/services/upload-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AppConstants } from "../../../../shared/data/constants";
import { AppPermission } from 'app/shared/data/roles';



@Component({
  selector: 'app-upload-portfolio',
  templateUrl: './upload-portfolio.component.html',
  styleUrls: ['./upload-portfolio.component.scss']
})
export class UploadPortfolio implements OnInit {
  public files: any[] = [];
  disableUploadBTn = false

  formData = new FormData();
  @Input() portfolio_id: null
  @Output() fileuploaded = new EventEmitter();
  public form: FormGroup;
  //portfilioForm: FormGroup;

  pdfTemplate = AppConstants.PDF_TEMPLATE;
  selectedRadio = null
  single_portfolio_name = null
  upload_msg = "Please wait while your file is uploading..."
  permissions = AppPermission.get().PorftolioAnalytics_DataManager

  constructor(private builder: FormBuilder, private uploadFile: UploadDataService, private toastr: ToastrService, private modalService: NgbModal, private spinner: NgxSpinnerService) {
    this.form = this.builder.group({
      files: ['', Validators.required]
    });
  }

  ngOnInit() {

  }


  onFileChange(pFileList: File[]) {
    this.files = Object.keys(pFileList).map(key => pFileList[key]);

  }

  deleteFile(f) {
    this.files = this.files.filter(function (w) { return w.name != f.name });

  }


  deleteFromArray(index) {
    this.files.splice(index, 1);
    this.form.controls["files"].setValue(this.files)
  }

  openPortfolioModal(portfolio) {
    this.modalService.open(portfolio, {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title',
      scrollable: true,
      backdrop: 'static',
      centered: true
    })
  }
  upload() {
    // if(this.portfilioForm.invalid){
    //   return
    // }
    this.modalService.dismissAll()
    this.submit()

  }
  // get rf() {
  //   return this.portfilioForm.controls;
  // }
  close() {
    this.modalService.dismissAll()
  }
  openPortfolioNameModal(portfolionames) {
    this.modalService.open(portfolionames, {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title',
      scrollable: true,
      backdrop: 'static',
      centered: true
    })
  }
  async submit() {

    try {
      this.spinner.show()
      let formData = new FormData()
      Array.from(this.files).forEach(f => formData.append('file', f))
      for (let file of this.files) {
        if (file.type !== "text/csv" && file.type in AppConstants.excel_file_types) return this.toastr.error("Only CSV and excel files are allowed", "", { timeOut: 4000 })
        let fileSizeInMbs = ((file.size / 1024) / 1024)
        if (fileSizeInMbs > 50) return this.toastr.error("Maximum file size 50Mb allowed", "", { timeOut: 4000 })
        if (file.portfolio_name) { formData.append("portfolio_name", file.portfolio_name) }
      }
      this.disableUploadBTn = true
      try {
        setTimeout(() => {
          this.upload_msg = "This file appears to be large. Hang tight while we process your data. This could take several minutes...";
        }, 20000);
        setTimeout(() => {
          this.upload_msg = "Hold on. This file appears to be very large. Hang tight while we process your data. This could take several minutes...";
        }, 80000);
        await this.uploadFile.uploadFile(formData)
        this.fileuploaded.emit()
        this.close()
      } catch (err) {
        let e = err.error;
        this.disableUploadBTn = false

        this.spinner.hide()

        if (err.status == 403) {
          return this.toastr.error(err.error.detail)
        }

        let messages = e.detail

        for (let m of messages) {
          if (m.length > 1) {
            this.toastr.error(m, "",
              { enableHtml: true, timeOut: 0 })
          }
        }

        return

      }

      this.files = []
      this.disableUploadBTn = false
      this.form.reset()
      this.toastr.success("File successfully uploaded and validated!", "", { timeOut: 4000, enableHtml: true, })
      this.disableUploadBTn = false
      this.spinner.hide()
    } catch (e) {
      this.disableUploadBTn = false

      this.spinner.hide()

      return this.toastr.error(e.file, "", { timeOut: 4000 })
    }
  }

}