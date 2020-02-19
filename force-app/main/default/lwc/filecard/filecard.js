import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
import { classSet } from 'c/classSet';

import DATA from '@salesforce/schema/ContentVersion.VersionData';
import TITLE from '@salesforce/schema/ContentVersion.Title';
import EXTENSION from '@salesforce/schema/ContentVersion.FileExtension';
import CD from '@salesforce/schema/ContentVersion.ContentDocumentId';

export default class Filecard extends NavigationMixin(LightningElement) {
  @api cvId;
  @api showTitle;
  @api aspectRatio;

  @wire(getRecord, {
    recordId: '$cvId',
    fields: [DATA, TITLE, EXTENSION, CD]
  })
  wiredRecord;

  get imgUrl() {
    return `data:image/${this.wiredRecord.data.fields.FileExtension.value};base64,${this.wiredRecord.data.fields.VersionData.value}`;
  }

  get title() {
    if (
      this.showTitle &&
      this.wiredRecord &&
      this.wiredRecord.data &&
      this.wiredRecord.data.fields
    ) {
      return `${this.wiredRecord.data.fields.Title.value}.${this.wiredRecord.data.fields.FileExtension.value}`;
    }
    return false;
  }

  get outerClass() {
    return classSet('slds-file slds-file_card').add({
      //   'slds-has-title': this.showTitle && this.computeTitle(),
      'slds-has-title': this.showTitle && this.title,

      'slds-file_loading': !this.wiredRecord.data
    });
  }

  get hrefClass() {
    return classSet('slds-file__crop').add({
      'slds-file__crop_1-by-1': this.aspectRatio === '1x1',
      'slds-file__crop_4-by-3': this.aspectRatio === '4x3',
      'slds-file__crop_16-by-9': this.aspectRatio === '16x9'
    });
  }

  toFile(event) {
    event.preventDefault();
    if (this.isCommunity()) {
      this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
          objectApiName: 'ContentDocument',
          actionName: 'view',
          recordId: this.wiredRecord.data.fields.ContentDocumentId.value
        }
      });
    } else {
      this[NavigationMixin.Navigate]({
        type: 'standard__namedPage',
        attributes: {
          pageName: 'filePreview'
        },
        state: {
          //   recordIds: [this.wiredRecord.data.fields.ContentDocumentId.value],
          selectedRecordId: this.wiredRecord.data.fields.ContentDocumentId.value
        }
      });
    }
  }

  isCommunity() {
    return window.location.pathname.includes('/s/');
  }
}
