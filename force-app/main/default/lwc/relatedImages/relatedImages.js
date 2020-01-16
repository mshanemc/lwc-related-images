import { LightningElement, api, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

import getRelatedImages from '@salesforce/apex/relatedImages.getRelatedImages';

export default class RelatedImages extends NavigationMixin(LightningElement) {
  @api recordId;
  @api variant = 'grid';
  @api itemsPerRow = '6';
  @api wrapped = false;
  @api title;
  @track modifiedImages = [];

  // get the releated urls for displaying the images
  @wire(getRelatedImages, { recordId: '$recordId' })
  images({ data, error }) {
    if (error) {
      console.error(error);
    }
    if (data) {
      this.gotData = true;
      this.modifiedImages = [...data].map(image => {
        let imageUrl = `/sfc/servlet.shepherd/version/download/${
          image.Id.split('-')[0]
        }`;
        if (this.isCommunity()) {
          imageUrl = `/${this.getCommunityPath()}${imageUrl}`;
        }
        return {
          ...image,
          imageUrl
        };
      });
      console.log(this.modifiedImages);
    }
  }

  get isCarousel() {
    return this.variant === 'carousel' && this.modifiedImages.length > 0;
  }

  get isGrid() {
    return this.variant === 'grid' && this.modifiedImages.length > 0;
  }

  get isEmpty() {
    return this.modifiedImages.length === 0 && this.gotData;
  }

  get RowStyle() {
    let repeats = this.itemsPerRow;
    if (this.itemsPerRow < 1 || this.itemsPerRow > this.modifiedImages.length) {
      // divide the space equally;
      repeats = this.modifiedImages.length;
    }
    return `grid-template-columns: repeat(${repeats}, 1fr);`;
  }

  toFile(event) {
    this[NavigationMixin.Navigate]({
      type: 'standard__namedPage',
      attributes: {
        pageName: 'filePreview'
      },
      state: {
        recordIds: this.modifiedImages
          .map(img => img.ContentDocumentId)
          .join(','),
        selectedRecordId: event.target.dataset.ContentDocumentId
      }
    });
  }

  isCommunity() {
    return window.location.pathname.includes('/s/');
  }

  getCommunityPath() {
    return window.location.pathname.split('/s/')[0].replace('/', '');
  }
}
