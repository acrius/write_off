import {getStorageName} from '../../utils';

export function move(state) {

  const headTable = [
    [
      {text: 'Дата составления', colSpan: 1, rowSpan: 2},
      {text: 'Код вида операции', colSpan: 1, rowSpan: 2},
      {text: 'Отправитель', colSpan: 2, rowSpan: 1}, {},
      {text: 'Получатель', colSpan: 2, rowSpan: 1}, {},
      {text: 'Корреспондирующий счет', colSpan: 2, rowSpan: 1}, {},
      {text: 'Учетная единица выпуска продукции', colSpan: 1, rowSpan: 2}],
    [
      {}, {}, {text: 'Структурное подразделение', colSpan: 1, rowSpan: 1},
      {text: 'Вид дейятельности', colSpan: 1, rowSpan: 1},
      {text: 'Структурное подразделение', colSpan: 1, rowSpan: 1},
      {text: 'Вид деятельности', colSpan: 1, rowSpan: 1},
      {text: 'Счет', colSpan: 1, rowSpan: 1},
      {text: 'Код аналитического учета', colSpan: 1, rowSpan: 1}, {}],
    [
      {text: state.selectedActDateString, colSpan: 1, rowSpan: 1},
      {text: ' ' , colSpan: 1, rowSpan: 1},
      {text: getStorageName(state.selectedActStorage, state.storages), colSpan: 1, rowSpan: 1},
      {text: ' ', colSpan: 1, rowSpan: 1},
      {text: getStorageName(state.selectedReceiverStorage, state.storages), colSpan: 1, rowSpan: 1},
      {text: ' ', colSpan: 1, rowSpan: 1},
      {text: ' ', colSpan: 1, rowSpan: 1},
      {text: ' ', colSpan: 1, rowSpan: 1},
      {text: ' ', colSpan: 1, rowSpan: 1}
    ]];

  const moveHead = [[
    {text: 'Корреспондирующий счет', colSpan: 2, rowSpan: 1}, {},
    {text: 'Материальные ценности', colSpan: 2, rowSpan: 1}, {},
    {text: 'Единица измерения', colSpan: 2, rowSpan: 1}, {},
    {text: 'Количество', colSpan: 2, rowSpan: 1}, {},
    {text: 'Цена, руб. коп.', colSpan: 1, rowSpan: 2},
    {text: 'Сумма без учета НДС, руб. коп.', colSpan: 1, rowSpan: 2},
    {text: 'Порядковый номер по складской картотеке', colSpan: 1, rowSpan: 2}],
  [
    {text: 'Счет', colSpan: 1, rowSpan: 1}, {text: 'Код аналити- ческого учета', colSpan: 1, rowSpan: 1},
    {text: 'Наименование', colSpan: 1, rowSpan: 1}, {text: 'Номенклатурный номер', colSpan: 1, rowSpan: 1},
    {text: 'Код', colSpan: 1, rowSpan: 1}, {text: 'Наименование', colSpan: 1, rowSpan: 1},
    {text: 'Затре- бовано', colSpan: 1, rowSpan: 1}, {text: 'Отпу- щено', colSpan: 1, rowSpan: 1},
    {}, {}, {}
  ],
  [
    {text: '1', colSpan: 1, rowSpan: 1}, {text: '2', colSpan: 1, rowSpan: 1},
    {text: '3', colSpan: 1, rowSpan: 1}, {text: '4', colSpan: 1, rowSpan: 1},
    {text: '5', colSpan: 1, rowSpan: 1}, {text: '6', colSpan: 1, rowSpan: 1},
    {text: '7', colSpan: 1, rowSpan: 1}, {text: '8', colSpan: 1, rowSpan: 1},
    {text: '9', colSpan: 1, rowSpan: 1}, {text: '10', colSpan: 1, rowSpan: 1},
    {text: '11', colSpan: 1, rowSpan: 1},
  ]];

  const moveTable = state.actTable.map(act =>
    [
      {text: act.account, colSpan: 1, rowSpan: 1},
      {text: ' ', colSpan: 1, rowSpan: 1},
      {text: act.name, colSpan: 1, rowSpan: 1},
      {text: act.code, colSpan: 1, rowSpan: 1},
      {text: act.unit_code, colSpan: 1, rowSpan: 1},
      {text: act.unit, colSpan: 1, rowSpan: 1},
      {text: act.amount, colSpan: 1, rowSpan: 1},
      {text: act.amount, colSpan: 1, rowSpan: 1},
      {text: '           ', colSpan: 1, rowSpan: 1},
      {text: '           ', colSpan: 1, rowSpan: 1},
      {text: ' ', colSpan: 1, rowSpan: 1}
    ]
  );

  let amountSum = 0;

  state.actTable.forEach((row) => {
    amountSum += parseFloat(row.amount)
  });

  const moveFooter = [[{text: 'ИТОГО', colSpan: 6, rowSpan: 1, alignment: 'right'}, {}, {}, {}, {}, {},
                       {text: amountSum.toString(), colSpan: 1, rowSpan: 1}, {text: amountSum.toString(), colSpan: 1, rowSpan: 1},
                      {text: ' ', colSpan: 1, rowSpan: 1}, {text: ' ', colSpan: 1, rowSpan: 1}, {text: ' ', colSpan: 1, rowSpan: 1}]];

  const move = moveHead.concat(moveTable).concat(moveFooter);

  var doc = {
    info: {
      title: 'ТРЕБОВАНИЕ-НАКЛАДНАЯ № ' + state.selectedAct
    },
    pageSize: 'A4',
    pageMargins: [20, 30, 40, 20],
    footer: (currentPage, pageCount) => {
      return {
        text: 'Стр. ' + currentPage.toString() + ' из ' + pageCount.toString(),
        alignment: 'right',
        fontSize: 8,
        margin: [0, 0, 20, 0]
      };
    },
    content: [
      {
        text: 'Типовая межотраслевая форма № М-11',
        fontSize: 7,
        alignment: 'right'
      },
      {
        text: 'Утверждена постановлением Госкомстата России от 30.10.97 № 71а',
        fontSize: 7,
        alignment: 'right'
      },
      {
        columns: [
          {
            stack: [
              {
                text: 'ТРЕБОВАНИЕ-НАКЛАДНАЯ № ' + state.selectedAct,
                fontSize: 10,
                margin: [110, 2]
              },
              {
                text: 'Организация ООО "Док "Енисей"',
                fontSize: 10
              },
              {
                canvas: [{
                  type: 'line',
                  x1: 0, y1: 0, x2: 380, y2: 0, lineWidth: 0.5
                }]
              }
            ],
            width: 400,
          },
          [
            {
              text: 'Форма по ОКУД',
              fontSize: 10,
              alignment: 'right',
              margin: [0, 20, 5, 0]
            },
            {
              text: 'По ОКПО',
              fontSize: 10,
              alignment: 'right',
              margin: [0, 5, 5, 0]
            }
          ],
          {
            table: {
              body: [
                ['Коды'],
                ['0315006'],
                ['58799982']
              ],
            },
            fontSize: 10,
            width: 55
          }
        ]
      },
      {
        table: {
          headerRows: 2,
          body: headTable
        },
        fontSize: 8,
        alignment: 'center',
        margin: [0, 10]
      },
      {
        text: 'Через кого________' + state.selectedStorekeeper,
        fontSize: 10
      },
      {
        columns: [
          {
            text: 'Затребовал',
            fontSize: 10
          },
          {
            text: 'Разрешил_________________________________',
            fontSize: 10
          }
        ]
      },
      {
          table: {
            headerRows: 2,
            body: move
          },
          fontSize: 8,
          alignment: 'center',
          margin: [0, 10, 30, 0],
          width: 600
        },
        {
          columns: [
            {
              columns: [
                {
                  text: 'Отпустил',
                  fontSize: 10,
                  width: 50
                },
                {
                  stack: [
                    {
                      text: 'Кладовщик',
                      fontSize: 10,
                      margin: [0, 0]
                    },
                    {
                      text: '_____________',
                      fontSize: 10,
                      margin: [0, -10]
                    },
                    {
                      text: 'должность',
                      fontSize: 6,
                      margin: [10, 10]
                    }
                  ],
                  width: 50
                },
                {
                  stack:
                  [
                    {
                      text: '__________',
                      fontSize: 10,
                      margin: [15, 1.5]
                    },
                    {
                      text: 'подпись',
                      fontSize: 6,
                      margin: [30, -1]
                    }
                  ],
                  width: 45
                },
                {
                  stack: [
                    {
                      text: state.selectedStorekeeper,
                      fontSize: 10,
                      margin: [20, 0],
                    },
                    {
                      text: '__________________',
                      fontSize: 10,
                      margin: [20, -10]
                    },
                    {
                      text: 'расшифровка подписи',
                      fontSize: 6,
                      margin: [22, 10]
                    }
                  ],
                  width: 110
                }
              ]
            },
            {
              columns: [
                {
                  text: 'Получил',
                  fontSize: 10,
                  width: 50,
                  margin: [-40, 0]
                },
                {
                  stack: [
                    {
                      text: '__________________',
                      fontSize: 10,
                      margin: [15, 1.5]
                    },
                    {
                      text: 'должность',
                      fontSize: 6,
                      margin: [40, -1]
                    },
                  ],
                  width: 100,
                  margin: [-60, 0]
                },
                {
                  stack: [
                    {
                      text: '____________',
                      fontSize: 10,
                      margin: [15, 1.5]
                    },
                    {
                      text: 'подпись',
                      fontSize: 6,
                      margin: [30, -1]
                    },
                  ],
                  width: 60,
                  margin: [-72, 0]
                },
                {
                  stack: [
                    {
                      text: '___________________',
                      fontSize: 10,
                      margin: [15, 1.5]
                    },
                    {
                      text: 'расшифровка',
                      fontSize: 6,
                      margin: [40, -1]
                    },
                  ],
                  width: 80,
                  margin: [-70, 0]
                }
              ]
            }
          ],
          margin: [0, 20]
        }
    ]
  };

  pdfMake.createPdf(doc).download('Накладаная №' + state.selectedAct + '.pdf');
}

export function write(state) {
  const tableHead = [[
    {text: 'Дата', fontSize: 8}, {text: 'Часы проведения работ', fontSize: 8},
    {text: 'Наименование работы', fontSize: 8}, {text: 'Код материала', fontSize: 8},
    {text: 'Наименование материала', fontSize: 8}, {text: 'Счет учета', fontSize: 8},
    {text: 'Кол-во', fontSize: 8}, {text: 'Цена', fontSize: 8},
    {text: 'Сумма', fontSize: 8}, {text: 'Водитель / Слесарь подпись', fontSize: 8}]];

  const tableBody = state.actTable.map(
    (row) => {
      const date_of_write_off = 'date_of_write_off' in row && row.date_of_write_off ? row.date_of_write_off : state.selectedActDateString;
      return [{text: date_of_write_off, fontSize: 8}, {text: row.time, fontSize: 8},
              {text: row.work_name, fontSize: 8}, {text: row.code, fontSize: 8},
              {text: row.name, fontSize: 8}, {text: row.account, fontSize: 8},
              {text: row.amount, fontSize: 8}, {text: ' ', fontSize: 8},
              {text: ' ', fontSize: 8}, {text: ' ', fontSize: 8}];
            });

  const table = tableHead.concat(tableBody);

  const committee = [
    {post: 'Заведующая складом', name: 'Казимирова Л.А.'},
    {post: 'Главный бухгалтер', name: 'Фомина Л.Е.'},
    {post: 'Начальник АТЦ', name: 'Лапин А.С.'},
    {post: 'Инженер-механик по автотранспорту', name: 'Лукашевич Е.А.'},
    {post: 'Менеждер по снабжению', name: 'Асташкин А.В.'},
    {post: 'Механик', name: '____________________'}
    ];

  var doc = {
    info: {
      title: 'ВЕДЕОМОСТЬ № ' + state.selectedAct
    },
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [20, 30, 40, 20],
    footer: (currentPage, pageCount) => {
      return {
        text: 'Стр. ' + currentPage.toString() + ' из ' + pageCount.toString(),
        alignment: 'right',
        fontSize: 8,
        margin: [0, 0, 20, 0]
      };
    },
    content: [
      {
        columns: [
          {
            text: 'Подразделение ' + state.subdivisions.filter((subdivision) => subdivision.id === state.selectedSubdivision)[0].name,
            fontSize: 10
          },
          {
            stack: [
              {
                text: 'УТВЕРЖДАЮ',
                alignment: 'right',
                fontSize: 10
              },
              {
                text: 'Директор по лесозаготовкам ООО Док "ЕНИСЕЙ"',
                alignment: 'right',
                fontSize: 10
              },
              {
                text: '_________________Дьяченко И.И.',
                alignment: 'right',
                fontSize: 10
              },
              {
                text: '"     "___________20_____г.',
                alignment: 'right',
                fontSize: 10
              }
            ]
          }
        ]
      },
      {
        text: 'ВЕДОМОСТЬ УЧЕТА РЕМОНТНЫХ РАБОТ И ИСПОЛЬЗОВАНИЯ ЗАПАСНЫХ ЧАСТЕЙ',
        alignment: 'center',
        fontSize: 12,
        margin: [0, 20]
      },
      {
        text: 'Транспортное средство ' + getStorageName(state.selectedActStorage, state.storages),
        fontSize: 10,
        margin: [0, 10]
      },
      {
        table: {
          headerRows: 1,

          body: table
        },
        margin: [0, 10]
      },
      {
        text: 'КОМИССИЯ',
        fontSize: 12,
        margin: [40, 20]
      },
      [
      ...committee.map((employee) => {
        return {columns: [
            {text: employee.post, fontSize: 10, alignment: 'right'},
            {text: '____________________________________________', fontSize: 10, alignment: 'center'},
            {text: '/' + employee.name + '/', fontSize: 10, alignment: 'left'},
          ], alignment: 'center'};}), ]
    ]
  };

  pdfMake.createPdf(doc).download('Ведомость № ' + state.selectedAct + '.pdf');
}
