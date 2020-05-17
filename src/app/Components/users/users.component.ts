import {Component, OnInit} from '@angular/core';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {RandomUser} from '../../Data/RandomUser';
import {UsersService} from '../../Services/users.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  total = 1;
  listOfRandomUser: RandomUser[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  filterGender = [
    {text: 'male', value: 'male'},
    {text: 'female', value: 'female'}
  ];
  filterRoles = [
    {text: 'Professor', value: 'Professor'},
    {text: 'Student', value: 'Student'},
    {text: 'Scolarity', value: 'Scolarity'}
  ];

  constructor(private randomUserService: UsersService) {
  }

  loadDataFromServer(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    filter: Array<{ key: string; value: string[] }>
  ): void {
    this.loading = true;
    this.randomUserService.getUsers(pageIndex, pageSize, sortField, sortOrder, filter).subscribe(data => {
      this.loading = false;
      this.total = 200; // mock the total data here
      this.listOfRandomUser = data.results;
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    console.log(params);
    const {pageSize, pageIndex, sort, filter} = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    this.loadDataFromServer(pageIndex, pageSize, sortField, sortOrder, filter);
  }

  ngOnInit(): void {
    this.loadDataFromServer(this.pageIndex, this.pageSize, null, null, []);
  }

  getRandomTag(): string {
    const rnumber = Math.floor(Math.random() * 3) + 1;
    console.log(rnumber);
    switch (rnumber) {
      case 1:
        return 'Scolarity';
      case 2:
        return 'Student';
      case 3 :
        return 'Professor';
    }
  }

  getRandomTagColor() {
    const rnumber = Math.floor(Math.random() * 3) + 1;
    console.log(rnumber);
    switch (rnumber) {
      case 1:
        return 'green';
      case 2:
        return 'red';
      case 3 :
        return 'blue';
    }
  }
}
