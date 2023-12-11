import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
import { SpendingService } from '../services/spending.service';
import { BudgetTypeService } from '../services/budget-type.service';

@Component({
  selector: 'app-spending',
  templateUrl: './spending.component.html',
  styleUrls: ['./spending.component.css'],
})
export class SpendingComponent implements OnInit {
  spendingItems: any[] = [];
  budgetTypes: any[] = [];
  months: any[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  newSpendingItem: any = {
    _id: '',
    budgetTypeId: '',
    amountSpent: 0,
    month: '',
  };
  isEdit: boolean = false;
  modalRef: any;
  private modalService = inject(NgbModal);
  constructor(
    private spendingService: SpendingService,
    private budgetTypeService: BudgetTypeService
  ) {}

  ngOnInit(): void {
    this.getBudgetTypes();
    this.getSpendingItems();
  }

  getSpendingItems() {
    return this.spendingService
      .getSpendingItems()
      .subscribe((response: any) => {
        this.spendingItems = response.data;
      });
  }
  getBudgetTypes() {
    return this.budgetTypeService
      .getBudgetTypes()
      .subscribe((response: any) => {
        this.budgetTypes = response.data;
      });
  }
  addSpendingItem() {
    if (
      this.newSpendingItem.budgetTypeId === '' ||
      this.newSpendingItem.amountSpent === '' ||
      this.newSpendingItem.amountSpent === 0 ||
      this.newSpendingItem.month === ''
    ) {
      swal.fire('Error!', 'Please fill out all fields', 'error');
    }
    this.newSpendingItem = {
      budgetTypeId: this.newSpendingItem.budgetTypeId,
      amountSpent: this.newSpendingItem.amountSpent,
      month: this.newSpendingItem.month,
    };
    this.spendingService
      .addSpendingItem(this.newSpendingItem)
      .subscribe((response: any) => {
        this.spendingItems.push(response.data);
        swal.fire('Success!', 'Spending Item Added', 'success');
        this.newSpendingItem = {
          _id: '',
          budgetTypeId: '',
          amountSpent: 0,
          month: '',
        };
        this.modalRef.close();
      });
  }
  updateSpendingItem(spentItem: any) {
    if (
      spentItem.budgetTypeId === '' ||
      spentItem.amountSpent === '' ||
      spentItem.amountSpent === 0 ||
      spentItem.month === ''
    ) {
      swal.fire('Error!', 'Please fill out all fields', 'error');
    }
    let id = spentItem._id;
    spentItem = {
      budgetTypeId: spentItem.budgetTypeId,
      amountSpent: spentItem.amountSpent,
      month: spentItem.month,
    };
    this.spendingService
      .updateSpendingItem(spentItem, id)
      .subscribe((response: any) => {
        console.log(response);
        const index = this.spendingItems.findIndex(
          (item) => item._id === response.data._id
        );
        this.spendingItems[index] = response.data;
        swal.fire('Success!', 'Spending Item Updated', 'success');
        this.modalRef.close();
        this.newSpendingItem = {
          _id: '',
          budgetTypeId: '',
          amountSpent: 0,
          budgetType: '',
        };
      });
  }

  openAddSpending(content: TemplateRef<any>, type: string, spentItem?: any) {
    console.log(spentItem);
    if (type === 'Add') {
      this.isEdit = false;
      this.newSpendingItem = {
        _id: '',
        budgetTypeId: '',
        amountSpent: 0,
        month: '',
      };
    } else if (type === 'Edit') {
      this.isEdit = true;
      this.newSpendingItem = {
        _id: spentItem._id,
        budgetTypeId: spentItem.budgetTypeId._id,
        amountSpent: spentItem.amountSpent,
        budgetType: spentItem.budgetTypeId.budgetType,
        month: spentItem.month,
      };
      console.log(this.newSpendingItem);
    }
    this.modalRef = this.modalService.open(content);
  }

  onSubmit() {
    if (this.isEdit) {
      console.log(this.newSpendingItem);
      this.updateSpendingItem(this.newSpendingItem);
    } else {
      this.addSpendingItem();
    }
  }
}
