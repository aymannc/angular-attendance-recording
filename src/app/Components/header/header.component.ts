import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  inputValue?: string;
  options: string[] = [];
  data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.'
  ];

  constructor(private modal: NzModalService) {
  }

  ngOnInit(): void {
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.options = value ? [value, value + value, value + value + value] : [];
  }

  showConfirm(): void {
    this.modal.confirm({
      nzTitle: '<i>Do you Want to logout?</i>',
      nzOnOk: () => console.log('OK')
    });
  }
}
