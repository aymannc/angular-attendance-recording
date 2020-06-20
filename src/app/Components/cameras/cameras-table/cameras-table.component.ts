import {Component, OnInit} from '@angular/core';
import {Camera, Status} from '../../../Data/APIDataClasses.module';
import {ApiService} from '../../../Services/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NzContextMenuService, NzDropdownMenuComponent, NzModalService} from 'ng-zorro-antd';
import {NzTableQueryParams} from 'ng-zorro-antd/table';

@Component({
  selector: 'app-cameras-table',
  templateUrl: './cameras-table.component.html',
  styleUrls: ['./cameras-table.component.css']
})
export class CamerasTableComponent implements OnInit {

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();
  total = 1;
  cameras: Camera[] = [];
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
        this.cameras.forEach((data, index) => this.updateCheckedSet(data.id, index % 2 !== 0));
        this.refreshCheckedStatus();
      }
    },
    {
      text: 'Select Even Row',
      onSelect: () => {
        this.cameras.forEach((data, index) => this.updateCheckedSet(data.id, index % 2 === 0));
        this.refreshCheckedStatus();
      }
    }
  ];
  private camera: Camera;

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
    console.log(this.cameras);
    this.cameras.forEach(item => this.updateCheckedSet(item.id, value));

    console.log('I\'ve checked all ', this.setOfCheckedId);
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.cameras.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.cameras.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  loadDataFromServer(
    pageIndex: number,
    pageSize: number,
    sortField?: string | null,
    sortOrder?: string | null,
    filter?: Array<{ key: string; value: string[] }>
  ): void {
    this.loading = true;
    this.apiService.getCameras(pageSize, pageIndex).subscribe(data => {
      this.loading = false;
      this.total = data.page.totalElements;
      this.cameras = data._embedded.cameras;
      this.apiService.injectCameras(this.cameras);
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
    console.log('loading data from the server');
    this.loadDataFromServer(this.pageIndex, this.pageSize, null, null, []);
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent, camera: Camera): void {
    this.nzContextMenuService.create($event, menu);
    this.camera = camera;
  }

  rightClickMenuDelete() {
    this.apiService.selectedCamera = this.camera;
    this.modal.confirm({
      nzTitle: '<i>Do you Want to delete this camera?</i>',
      nzOnOk: () => this.apiService.deleteUser().subscribe(success => {
          this.apiService.selectedCamera = null;
          this.loadDataFromServer(this.pageIndex, this.pageSize, null, null, []);
        }
        , error => {
          this.modal.error({
            nzTitle: '<i>Error deleting the camera!</i>',
            nzContent: error.error.message,
          });
        }),
    });
  }

  rightClickMenuDetails(data: Camera = null) {
    const link = data?._links?.self?.href || this.camera?._links?.self?.href;
    this.router.navigate(['/cameras', 'details']).then(() => this.apiService.setSelectedCamera(link));
  }

  rightClickMenuModify() {
    console.log('Modify ', this.camera);
  }

  getTagColor(type: string): string {
    switch (type) {
      case 'Up':
        return 'green';
      case 'Down':
        return 'red';
      case 'Unknown':
        return 'grey';
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


  getStatus(statuts: Status[]) {
    console.log(statuts);
    if (statuts !== null && statuts?.length >= 0) {
      return statuts[statuts.length - 1] ? 'Up' : 'Down';
    } else {
      return 'Unknown';
    }
  }
}
