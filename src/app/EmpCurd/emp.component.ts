import { Component } from '@angular/core';
import { Employee } from 'app/EmpCurd/emp';
import { FormGroup } from '@angular/forms/src/model';
import { FormBuilder, Validators } from '@angular/forms';
import { EmpService } from 'app/EmpCurd/EmpService';
declare var $: any;

@Component({
    selector: 'emp-data',
    templateUrl: 'emp.component.html'
})

export class EmpComponent {
    modalBody: string;
    modalTitle: string;

    empFormGroup: FormGroup;

    constructor(private fb: FormBuilder, private _empService: EmpService) {
    }

    ngOnInit(){
        this.createEmpFormGroup();
    }

    createEmpFormGroup() {
        this.empFormGroup = this.fb.group({
            FirstName: ['', [Validators.required]],
            LastName: ['', [Validators.required]],
            Gender: ['', [Validators.required]],
            Email: ['', [Validators.required]],
            Phone: ['', [Validators.required]],
            State: ['', [Validators.required]],
        })
    }

    getEmpDetails() {
        this._empService.getEmpDetails().subscribe(data => {
            console.log(data);
        }, error => {
            console.log("error: getDashboardDetails");
        });
    }

    addEmployee(){
        let empData = this.empFormGroup.value;
        console.log(empData);
        
        this._empService.addEmpDetails(empData).subscribe(data => {
            this.modalTitle = "Employee Registration";
            this.modalBody = "Employee details saved successfully.";
            $('#DeleteInfoModal').modal('show'); 
        }, error => {
            console.log("Error : saveJenkinDetails");
        });
    }

    editEmpModal(index: number){

    }

    deleteEmpModal(index: number){

    }

    /******************Employee Grid ************************/
    public rows: Array<any> = [];
    public columns: Array<any> = [
        { title: 'First Name', name: 'FirstName' },
        { title: 'Last Name', name: 'LastName' },
        { title: 'Gender', name: 'Gender' },
        { title: 'Email', name: 'Email' },
        { title: 'Phone', name: 'Phone' }
    ];
    public page: number = 1;
    public itemsPerPage: number = 5;
    public maxSize: number = 5;
    public numPages: number = 1;
    public length: number = 0;

    public config: any = {
        paging: true,
        sorting: { columns: this.columns },
        filtering: { filterString: '' },
        className: ['table-striped', 'table-bordered']
    };

    private data: Array<any> = [];

    rebindGrid(data) {
        let itemJsonData = [];
        let itemJson = {};
        for (let i = 0; i < data.length; i++) {
            itemJson = Object.assign({}, data[i], { index: i });
            itemJsonData.push(itemJson);
        }
        this.data = itemJsonData;
        this.onChangeTable(this.config);
    }

    public changePage(page: any, data: Array<any> = this.data): Array<any> {
        let start = (page.page - 1) * page.itemsPerPage;
        let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
        return data.slice(start, end);
    }

    public changeSort(data: any, config: any): any {
        if (!config.sorting) {
            return data;
        }

        let columns = this.config.sorting.columns || [];
        let columnName: string = void 0;
        let sort: string = void 0;

        for (let i = 0; i < columns.length; i++) {
            if (columns[i].sort !== '' && columns[i].sort !== false) {
                columnName = columns[i].name;
                sort = columns[i].sort;
            }
        }

        if (!columnName) {
            return data;
        }

        return data.sort((previous: any, current: any) => {
            if (previous[columnName] > current[columnName]) {
                return sort === 'desc' ? -1 : 1;
            } else if (previous[columnName] < current[columnName]) {
                return sort === 'asc' ? -1 : 1;
            }
            return 0;
        });
    }

    public changeFilter(data: any, config: any): any {
        let filteredData: Array<any> = data;
        this.columns.forEach((column: any) => {
            if (column.filtering) {
                filteredData = filteredData.filter((item: any) => {
                    if (item[column.name]) {
                        return item[column.name].toLowerCase().match(column.filtering.filterString.toLowerCase());
                    }
                });
            }
        });

        if (!config.filtering) {
            return filteredData;
        }

        if (config.filtering.columnName) {
            return filteredData.filter((item: any) => {
                if (item[config.filtering.columnName]) {
                    item[config.filtering.columnName].toLowerCase().match(this.config.filtering.filterString.toLowerCase())
                }
            });
        }

        let tempArray: Array<any> = [];
        filteredData.forEach((item: any) => {
            let flag = false;
            this.columns.forEach((column: any) => {
                if (item[column.name].toString().match(this.config.filtering.filterString)) {
                    flag = true;
                }
            });
            if (flag) {
                tempArray.push(item);
            }
        });
        filteredData = tempArray;

        return filteredData;
    }

    public onChangeTable(config: any, page: any = { page: this.page, itemsPerPage: this.itemsPerPage }): any {
        if (config.filtering) {
            Object.assign(this.config.filtering, config.filtering);
        }

        if (config.sorting) {
            Object.assign(this.config.sorting, config.sorting);
        }

        let filteredData = this.changeFilter(this.data, this.config);
        let sortedData = this.changeSort(filteredData, this.config);
        this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
        this.length = sortedData.length;
    }

    public onEditClick(data: any): any {
        this.editEmpModal(data.row.index);
    }
    public onDeleteClick(data: any): any {
        this.deleteEmpModal(data.row.index);
    }
}