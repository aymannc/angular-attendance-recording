import {Component, OnInit} from '@angular/core';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {NzContextMenuService, NzDropdownMenuComponent, NzModalService} from 'ng-zorro-antd';
import {ApiService} from '../../Services/api.service';
import {User} from '../../Data/APIDataClasses.module';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();
  total = 1;
  users: User[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  searchQeury: string;
  listOfSelection = [
    {
      text: 'Select All Row',
      onSelect: () => {
        this.onAllChecked(true);
      }
    },
    {
      text: 'Select Odd Row',
      onSelect: () => {
        this.users.forEach((data, index) => this.updateCheckedSet(data.idUtilisateur, index % 2 !== 0));
        this.refreshCheckedStatus();
      }
    },
    {
      text: 'Select Even Row',
      onSelect: () => {
        this.users.forEach((data, index) => this.updateCheckedSet(data.idUtilisateur, index % 2 === 0));
        this.refreshCheckedStatus();
      }
    }
  ];
  private user: User;

  constructor(private apiService: ApiService, private router: Router,
              private route: ActivatedRoute,
              private nzContextMenuService: NzContextMenuService,
              private modal: NzModalService) {
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    console.log(this.users);
    this.users.forEach(item => this.updateCheckedSet(item.idUtilisateur, value));

    console.log('I\'ve checked all ', this.setOfCheckedId);
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.users.every(item => this.setOfCheckedId.has(item.idUtilisateur));
    this.indeterminate = this.users.some(item => this.setOfCheckedId.has(item.idUtilisateur)) && !this.checked;
  }

  loadDataFromServer(
    pageIndex: number,
    pageSize: number,
    sortField?: string | null,
    sortOrder?: string | null,
    filter?: Array<{ key: string; value: string[] }>
  ): void {
    this.loading = true;
    this.apiService.getUsers(pageIndex, pageSize, sortField, sortOrder, filter).subscribe(data => {
      this.loading = false;
      this.total = data.page.totalElements;
      this.users = data._embedded.utilisateurs;
    }, error => {
      this.loading = false;
      console.log(error);
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const {pageSize, pageIndex, sort, filter} = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;

    this.setOfCheckedId = new Set<number>();
    this.loadDataFromServer(pageIndex, pageSize, sortField, sortOrder, filter);
  }

  ngOnInit(): void {
    this.loadDataFromServer(this.pageIndex, this.pageSize, null, null, []);
    this.apiService.getDepartments();
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent, user: User): void {
    this.nzContextMenuService.create($event, menu);
    this.user = user;
  }

  rightClickMenuDelete() {
    this.apiService.userDetails = this.user;
    this.modal.confirm({
      nzTitle: '<i>Do you Want to delete this user?</i>',
      nzOnOk: () => this.apiService.deleteUser().subscribe(success => {
          this.apiService.userDetails = null;
          this.loadDataFromServer(this.pageIndex, this.pageSize, null, null, []);
        }
        , error => {
          this.modal.error({
            nzTitle: '<i>Error deleting the user!</i>',
            nzContent: error.error.message,
          });
        }),
    });
  }

  rightClickMenuDetails(data: User = null) {
    const link = data?._links?.self?.href || this.user?._links?.self?.href;
    this.router.navigate(['/users', 'details']).then(() => this.apiService.setUserLink(link));
  }

  rightClickMenuModify() {
    console.log('Modify ', this.user);
  }

  getTagColor(type: string): string {
    switch (type) {
      case 'Scolarity':
        return 'blue';
      case 'Etudient':
        return 'green';
      case 'Prof' :
        return 'red';
    }
  }

  refreshList() {
    if (!this.loading) {
      this.loadDataFromServer(1, this.pageSize);
    }
  }

  searchForUser() {
    console.log(this.searchQeury);
  }

}
