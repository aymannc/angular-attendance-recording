import {Component, OnInit} from '@angular/core';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {NzContextMenuService, NzDropdownMenuComponent, NzModalService} from 'ng-zorro-antd';
import {ApiService} from '../../Services/api.service';
import {User} from '../../Data/UtilisateursResponse.module';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  checked = false;
  indeterminate = false;
  listOfCurrentPageData: User[] = [];
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
        this.listOfCurrentPageData.forEach((data, index) => this.updateCheckedSet(data.idUtilisateur, index % 2 !== 0));
        this.refreshCheckedStatus();
      }
    },
    {
      text: 'Select Even Row',
      onSelect: () => {
        this.listOfCurrentPageData.forEach((data, index) => this.updateCheckedSet(data.idUtilisateur, index % 2 === 0));
        this.refreshCheckedStatus();
      }
    }
  ];
  listOfData: User[] = [];
  setOfCheckedId = new Set<number>();
  total = 1;
  users: User[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  filterGender = [
    {text: 'male', value: 'male'},
    {text: 'female', value: 'female'}
  ];
  filterRoles = [
    {text: 'Etudient', value: 'Etudient'},
    {text: 'Prof', value: 'Prof'},
    {text: 'Scolarity', value: 'Scolarity'}
  ];
  searchValue = '';
  visible = false;
  private user: User;

  constructor(private apiService: ApiService, private router: Router,
              private route: ActivatedRoute,
              private nzContextMenuService: NzContextMenuService,
              private modal: NzModalService) {
  }

  updateCheckedSet(idUtilisateur: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(idUtilisateur);
    } else {
      this.setOfCheckedId.delete(idUtilisateur);
    }
  }

  onItemChecked(idUtilisateur: number, checked: boolean): void {
    this.updateCheckedSet(idUtilisateur, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.idUtilisateur, value));
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: User[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.idUtilisateur));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.idUtilisateur)) && !this.checked;
  }

  loadDataFromServer(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    filter: Array<{ key: string; value: string[] }>
  ): void {
    console.log('Getting Data', pageIndex, pageSize, sortField, sortOrder, filter);
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

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent, user: User): void {
    this.nzContextMenuService.create($event, menu);
    this.user = user;
  }

  closeMenu(): void {
    this.nzContextMenuService.close();
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    this.users = this.listOfData.filter((item: User) =>
      (item.perssone.nom + item.perssone.prenom).indexOf(this.searchValue) !== -1);
  }

  rightClickMenuDelete() {
    console.log(this.user);
    this.modal.confirm({
      nzTitle: '<i>Do you Want to delete this user?</i>',
      nzOnOk: () => console.log('OK')
    });
  }

  rightClickMenuDetails(data: User = null) {
    const link = data?._links?.self?.href || this.user?._links?.self?.href;
    this.router.navigate(['/users', 'details']).then(() => this.apiService.setUserLink(link));
  }

  rightClickMenuModify() {
    console.log('Modify ', this.user);
  }

  getRandomTagColor(type: string): string {
    switch (type) {
      case 'Scolarity':
        return 'blue';
      case 'Etudient':
        return 'green';
      case 'Prof' :
        return 'red';
    }
  }
}
