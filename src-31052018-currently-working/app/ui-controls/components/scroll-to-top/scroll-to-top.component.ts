import {Component, HostListener, Input, OnInit} from '@angular/core';
import {ScrollService} from '../../services/scroll.service';

/**
 * Component to show a scroll to top button once a specified scroll distance is reached
 */
@Component({
  selector: 'gpr-scroll-to-top',
  template: `
    <button class="btn btn-primary scroll-to-top"
            [class.in]="displayScrollToTop"
            (click)="scrollToTop()">
      <i class="material-icons">expand_less</i>
    </button>
  `,
  styleUrls: ['./scroll-to-top.component.scss']
})
export class ScrollToTopComponent implements OnInit {

  /**
   * The scroll threshold when to display the scroll to top button
   */
  @Input() scrollThreshold: number = 200;

  /**
   * Indicates whether to display the scroll to top button
   */
  public displayScrollToTop: boolean = false;

  /**
   * Creates the scroll to top component
   * @param {ScrollService} _scrollService
   */
  constructor(private _scrollService: ScrollService) {
  }

  /**
   * On init, display the scroll to top button if the user has scrolled
   */
  ngOnInit(): void {
    this._updateDisplayScrollToTop();
  }

  /**
   * Updates whether to show the scroll to top button when the window is scrolled
   */
  @HostListener('window:scroll', [])
  public onWindowScroll(): void {
    this._updateDisplayScrollToTop();
  }

  /**
   * Scrolls the page to the top
   */
  public scrollToTop(): void {
    this._scrollService.scrollToTop();
  }

  /**
   * Updates whether to show the scroll to top button
   */
  private _updateDisplayScrollToTop(): void {
    const scrollDistance = this._scrollService.getScrollDistance();
    this.displayScrollToTop = scrollDistance > this.scrollThreshold;
  }
}
