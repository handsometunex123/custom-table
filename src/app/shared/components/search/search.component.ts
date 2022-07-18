import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'scalio-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  /**
   * Property for the actualTextValue
   */
  public currentTextValue: string = '';

  /**
   * Initial value to set
   */
  public initialValue = '';

  /**
   * Placeholder text property bind
   */
  @Input() public placeholder = '';

  /**
   * Text align property bind
   */
  @Input() public textAlign: 'left' | 'right' | 'center' = 'left';

  /**
   * Event to emit the pressed key
   */
  @Output() public searchStringEvent = new EventEmitter<string>();

  /**
   * Set initial value
   *
   * @param value
   */
  @Input() public set initValue(value: string) {
    this.currentTextValue = value;
    this.initialValue = value;
  }
  constructor() {}

  public submitSearch(): void {
    this.searchStringEvent.emit(this.currentTextValue);
  }

  /**
   * Clears the input
   */
  public clearEvent(): void {
    this.currentTextValue = '';
    this.initialValue = '';
  }
}
