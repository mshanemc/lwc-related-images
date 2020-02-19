import { LightningElement, api, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

import getRelatedImages from '@salesforce/apex/relatedImages.getRelatedImages';

export default class RelatedImages extends NavigationMixin(LightningElement) {
  @api recordId;
  @api variant;
  @api itemsPerRow;
  @api wrapped = false;
  @api title;
  @track modifiedImages = [];
  @api showTitles;
  @api aspectRatio;

  // get the related urls for displaying the images
  @wire(getRelatedImages, { recordId: '$recordId' })
  images({ data, error }) {
    if (error) {
      console.error(error);
    }
    if (data) {
      this.gotData = true;
      this.modifiedImages = data;
    }
  }

  get isEmpty() {
    return this.modifiedImages.length === 0 && this.gotData;
  }

  get RowStyle() {
    return `grid-template-columns: repeat(${this.itemsPerRow ||
      this.modifiedImages.length}, 1fr);`;
  }
}
