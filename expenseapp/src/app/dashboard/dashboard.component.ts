import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartOptions } from 'chart.js/auto';
import { SpendingService } from '../services/spending.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('spendingBarChart')
  spendingBarChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('spendingPieChart')
  spendingPieChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('monthlyExpenseLineChart')
  monthlyExpenseLineChartCanvas!: ElementRef<HTMLCanvasElement>;

  selectedMonth: any = 'All';
  private spendingBarChart!: any;
  private spendingPieChart: any;
  //private monthlyExpenseLineChart: Chart;

  barChartLabels = [];
  barChartType = 'bar';
  barChartLegend = true;
  barChartData = [];

  // pie chart config
  pieChartOptions = {
    responsive: true,
  };
  pieChartLabels = [];
  pieChartData = [];
  pieChartType = 'pie';
  pieChartLegend = true;
  pieChartPlugins = [];
  selectedMonthData: any = [];
  // line chart config
  lineChartOptions = {
    responsive: true,
  };
  lineChartLabels:any = [];
  lineChartData = [];
  lineChartType = 'line';
  lineChartLegend = true;
  lineChartPlugins = [];

  constructor(private spendingService: SpendingService) {}
  ngOnDestroy(): void {
    this.spendingBarChart?.destroy();
  }

  ngAfterViewInit(): void {}

  ngOnInit() {
    this.getMonthlyExpenseLineChart();
    this.getSpendingPieChart();
    this.getSpendingBarChart();
  }

  getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }
  getMonthlyExpenseLineChart() {
    this.spendingService.getMonthlyExpense().subscribe(
      (data: any) => {

        console.log(this.lineChartData);
        this.lineChartLabels = ["January","Febuary","March","April","May","June","July","August","September","October","November","December"];
        this.lineChartData = this.lineChartLabels.map((d: any) => {
          const month = d;
          return {
            month,
            amount: data.data.filter((a: any) => a.month === month).reduce((a: any, b: any) => a + b.spending, 0),
          };
        }
        );
       console.log(this.lineChartData);
        const ctx =
          this.monthlyExpenseLineChartCanvas.nativeElement.getContext('2d');
        if (ctx) {
          this.spendingBarChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: this.lineChartLabels,
              datasets: [
                {
                  label: 'Monthly Expense',
                  fill: false,
                  data: this.lineChartData.map((d: any) => d.amount),
                  backgroundColor: '#3cba9f',
                  borderWidth: 1,
                  borderColor: '#000000',
                },
              ],
            },
            //options:this.barChartOptions
          });
        }
      },
      (error: any) => {
        // Handle error, display an error message, etc.
        console.error('Failed to fetch chart data:', error);
      }
    );
  }
  getSpendingPieChart() {
    this.spendingService.getMonthlySpendingItems().subscribe(
      (data: any) => {
        this.pieChartData = data.data;
        this.updateChart(data.data);
      },
      (error: any) => {
        // Handle error, display an error message, etc.
        console.error('Failed to fetch chart data:', error);
      }
    );
  }
  getSpendingBarChart() {
    this.spendingService.getMonthlyExpense().subscribe(
      (data: any) => {
        const ctx = this.spendingBarChartCanvas.nativeElement.getContext('2d');
        // Update chart data, labels, options, etc.
        data = data.data;
        let currentMonth = this.getCurrentMonth();
        const budgetTypes = Array.from(new Set(data.map((d: any) => d.budgetType)));
        data = data.filter((d: any) => d.month === currentMonth);
        data = budgetTypes.map((d: any) => {
          const budgetType = d;
          return {
            budgetType,
            budgetAmount: data.find((c: any) => c.budgetType === budgetType).budgetAmount || 0,
            spendingAmount: data.filter((a: any) => a.budgetType === budgetType).reduce((a: any, b: any) => a + b.spending, 0
            ),
          };
        });
        this.barChartLabels = data.map((d: any) => d.budgetType);
        const budget = data.map((d: any) => d.budgetAmount);
        console.log(budget);

        const expenses = data.map((d: any) => d.spendingAmount);
        console.log(expenses);
        const datasets = [
          {
            label: 'Budget',
            data: budget,
            backgroundColor: '#3cba9f',
            borderWidth: 1,
          },
          {
            label: 'Expenses',
            data: expenses,
            backgroundColor: '#c45850',
            borderWidth: 1,
          },
        ];
        if (ctx) {
          this.spendingBarChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: this.barChartLabels,
              datasets: datasets,
            },
            //options:this.barChartOptions
          });
        }
      },
      (error: any) => {
        // Handle error, display an error message, etc.
        console.error('Failed to fetch chart data:', error);
      }
    );
  }
  /**
   *
   * @returns   current month in the format of String In January
   */
  getCurrentMonth() {
    const date = new Date();
    const month = date.getMonth();
    switch (month) {
      case 0:
        return 'January';
      case 1:
        return 'Febuary';
      case 2:
        return 'March';
      case 3:
        return 'April';
      case 4:
        return 'May';
      case 5:
        return 'June';
      case 6:
        return 'July';
      case 7:
        return 'August';
      case 8:
        return 'September';
      case 9:
        return 'October';
      case 10:
        return 'November';
      case 11:
        return 'December';

      default:
        break;
    }
    return 'January';
  }
  onSelect(event: any) {
    console.log(this.selectedMonth);
    this.spendingPieChart.destroy();
    if (this.selectedMonth === 'All') {
      this.updateChart(this.pieChartData);
      return;
    }
    const pieChartData = this.pieChartData;
    const selectedMonthData = pieChartData.filter(
      (d: any) => d.month === this.selectedMonth
    );
    this.updateChart(selectedMonthData);
  }
  updateChart(data: any) {
    this.selectedMonthData = data;
    const budgetTypes = Array.from(new Set(data.map((d: any) => d.budgetTypeId.budgetType)));

    const pieChartLabels = budgetTypes;
     const pieChartData = budgetTypes.map((d: any) => {
      const budgetType = d;
      return {
        amount: data.filter((a: any) => a.budgetTypeId.budgetType === budgetType).reduce((a: any, b: any) => a + b.amountSpent, 0),
      };
    });
    const datasets = [
      {
        data: pieChartData.map((d: any) => d.amount),
        backgroundColor: data.map((d: any) => this.getRandomColor()),
        hoverBackgroundColor: data.map((d: any) => this.getRandomColor()),
      },
    ];
    const ctx = this.spendingPieChartCanvas.nativeElement.getContext('2d');
    if (ctx) {
      this.spendingPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: pieChartLabels,
          datasets: datasets,
        },
        //options:this.barChartOptions
      });
    }
  }
}
