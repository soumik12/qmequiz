import {Modal} from 'ngx-modialog/plugins/bootstrap';
import {Injectable} from "@angular/core";

@Injectable()
export class MessageProvider {
  constructor(public modal: Modal) {
  }

  showSuccessAlert(message) {
    return this.modal.alert().dialogClass('modal-dialog modal-success')
      .titleHtml('Success')
      .body(message)
      .open();
  }

  showFailedAlert(message) {
    return this.modal.alert().dialogClass('modal-dialog modal-danger')
      .titleHtml('Failure')
      .body(message)
      .open();
  }

  showYesNoConfirm(title, message) {
    return this.modal.confirm().dialogClass('modal-dialog modal-custom')
      .body(message)
      .titleHtml(title)
      .okBtn('YES').cancelBtn('NO')
      .okBtnClass('btn btn-success').cancelBtnClass('btn btn-danger').open();
  }
}
