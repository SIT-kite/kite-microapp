const campuses = {
  fengxian: {
    id: 0,
    name: "奉贤校区",
    latitude: 30.842652,
    longitude: 121.509,
  },
  xuhui: {
    id: 0,
    name: "徐汇校区",
    latitude: 31.166975,
    longitude: 121.422453,
  },
  changqiao: {
    id: 0,
    name: "长桥校区",
    latitude: 31.130782,
    longitude: 121.447082,
  },
  meilong: {
    id: 0,
    name: "梅陇校区",
    latitude: 31.138282,
    longitude: 121.426555,
  }
}

const fengxianPositions = [
  {
    id: 100,
    name: '体育馆',
    latitude: 30.83989,
    longitude: 121.505344,
    iconPath: "../../assets/icons/indoorStadium.png"
  },
  {
    id: 101,
    name: '一食堂',
    latitude: 30.845151,
    longitude: 121.511311,
    iconPath: "../../assets/icons/canteen.png"
  },
  {
    id: 102,
    name: '二食堂',
    latitude: 30.843024,
    longitude: 121.506793,
    iconPath: "../../assets/icons/canteen.png"
  },
  {
    id: 103,
    name: '三食堂',
    latitude: 30.842112,
    longitude: 121.512721,
    iconPath: "../../assets/icons/canteen.png"
  },
  {
    id: 104,
    name: '美食每刻',
    latitude: 30.840715,
    longitude: 121.505756,
    iconPath: "../../assets/icons/snack.png"
  },
  {
    id: 105,
    name: '图书馆',
    latitude: 30.842989,
    longitude: 121.511316,
    iconPath: "../../assets/icons/library.png"
  },
  {
    id: 106,
    name: '行政楼',
    latitude: 30.841071,
    longitude: 121.51101,
    iconPath: "../../assets/icons/administration.png"
  },
  {
    id: 107,
    name: '西南门',
    latitude: 30.83822,
    longitude: 121.50764,
    iconPath: "../../assets/icons/door.png"
  },
  {
    id: 108,
    name: '南门',
    latitude: 30.840491,
    longitude: 121.512111,
    iconPath: "../../assets/icons/door.png"
  },
  {
    id: 109,
    name: '火车头广场',
    latitude: 30.843661,
    longitude: 121.515241,
    iconPath: "../../assets/icons/locomotive.png"
  },
  {
    id: 1010,
    name: '大学生活动中心',
    latitude: 30.842282,
    longitude: 121.506992,
    iconPath: "../../assets/icons/studentActivity.png"
  },
  {
    id: 1011,
    name: '易班工作站',
    latitude: 30.842286,
    longitude: 121.506368,
    iconPath: "../../assets/icons/yibanStation.png"
  },
  {
    id: 1012,
    name: '第一教学楼',
    latitude: 30.841481,
    longitude: 121.50909,
    iconPath: "../../assets/icons/classroom.png"
  },
  {
    id: 1013,
    name: '医务楼',
    latitude: 30.842821,
    longitude: 121.505781,
    iconPath: "../../assets/icons/clinic.png"
  },
  {
    id: 1014,
    name: '第一学科楼',
    latitude: 30.843241,
    longitude: 121.51642,
    iconPath: "../../assets/icons/subjectBuilding.png"
  },
  {
    id: 1015,
    name: '第二学科楼',
    latitude: 30.844366,
    longitude: 121.515704,
    iconPath: "../../assets/icons/subjectBuilding.png"
  },
  {
    id: 1016,
    name: '第三学科楼',
    latitude: 30.845742,
    longitude: 121.515191,
    iconPath: "../../assets/icons/subjectBuilding.png"
  },
  {
    id: 1017,
    name: '第四学科楼',
    latitude: 30.843661,
    longitude: 121.513741,
    iconPath: "../../assets/icons/subjectBuilding.png"
  },
  {
    id: 1018,
    name: '第五学科楼',
    latitude: 30.843371,
    longitude: 121.51319,
    iconPath: "../../assets/icons/subjectBuilding.png"
  },
  {
    id: 1019,
    name: '第六学科楼',
    latitude: 30.841276,
    longitude: 121.50746,
    iconPath: "../../assets/icons/subjectBuilding.png"
  },
  {
    id: 1020,
    name: '东门',
    latitude: 30.845676,
    longitude: 121.516333,
    iconPath: "../../assets/icons/door.png"
  },
  {
    id: 1021,
    name: '第二教学楼',
    latitude: 30.842329,
    longitude: 121.509175,
    iconPath: "../../assets/icons/classroom.png"
  },
  {
    id: 1022,
    name: '第三教学楼',
    latitude: 30.843454,
    longitude: 121.508982,
    iconPath: "../../assets/icons/classroom.png"
  },
  {
    id: 1023,
    name: '菜鸟驿站',
    latitude: 30.841541,
    longitude: 121.505495,
    iconPath: "../../assets/icons/post.png"
  },
  {
    id: 1024,
    name: '菜鸟驿站（校外）',
    latitude: 30.846822,
    longitude: 121.516599,
    iconPath: "../../assets/icons/post.png"
  },
  {
    id: 1025,
    name: '韵达快递超市',
    latitude: 30.845509,
    longitude: 121.517679,
    iconPath: "../../assets/icons/post.png"
  },
  {
    id: 1026,
    name: '植物园',
    latitude: 30.844338,
    longitude: 121.517064,
    iconPath: "../../assets/icons/plant.png"
  },
];

const fengxianDormitories = {
  "1": {
    id: 1,
    name: '学生公寓1号楼',
    latitude: 30.845029,
    longitude: 121.512541
  },
  "2": {
    id: 2,
    name: '学生公寓2号楼',
    latitude: 30.845428,
    longitude: 121.512455
  },
  "3": {
    id: 3,
    name: '学生公寓3号楼',
    latitude: 30.845799,
    longitude: 121.512392
  },
  "4": {
    id: 4,
    name: '学生公寓4号楼',
    latitude: 30.846211,
    longitude: 121.512364
  },
  "5": {
    id: 5,
    name: '学生公寓5号楼',
    latitude: 30.846594,
    longitude: 121.512332
  },
  "6": {
    id: 6,
    name: '学生公寓6号楼',
    latitude: 30.846054,
    longitude: 121.512541
  },
  "7": {
    id: 7,
    name: '学生公寓7号楼',
    latitude: 30.845029,
    longitude: 121.511356
  },
  "8": {
    id: 8,
    name: '学生公寓8号楼',
    latitude: 30.845405,
    longitude: 121.510288
  },
  "9": {
    id: 9,
    name: '学生公寓9号楼',
    latitude: 30.845441,
    longitude: 121.510279
  },
  "10": {
    id: 10,
    name: '学生公寓10号楼',
    latitude: 30.845116,
    longitude: 121.509656
  },
  "11": {
    id: 11,
    name: '学生公寓11号楼',
    latitude: 30.844629,
    longitude: 121.509202
  },
  "12": {
    id: 12,
    name: '学生公寓12号楼',
    latitude: 30.843866,
    longitude: 121.508473
  },
  "13": {
    id: 13,
    name: '学生公寓13号楼',
    latitude: 30.84427,
    longitude: 121.508108
  },
  "14": {
    id: 14,
    name: '学生公寓14号楼',
    latitude: 30.84348,
    longitude: 121.507758
  },
  "15": {
    id: 15,
    name: '学生公寓15号楼',
    latitude: 30.843878,
    longitude: 121.507609
  },
  "16": {
    id: 16,
    name: '学生公寓16号楼',
    latitude: 30.843495,
    longitude: 121.50699
  },
  "17": {
    id: 17,
    name: '学生公寓17号楼',
    latitude: 30.841102,
    longitude: 121.506602
  },
  "18": {
    id: 18,
    name: '学生公寓18号楼',
    latitude: 30.841462,
    longitude: 121.506644
  },
  "19": {
    id: 19,
    name: '学生公寓19号楼',
    latitude: 30.841104,
    longitude: 121.505719
  },
  "20": {
    id: 20,
    name: '学生公寓20号楼',
    latitude: 30.841476,
    longitude: 121.505727
  },
  "21": {
    id: 21,
    name: '学生公寓21号楼',
    latitude: 30.841956,
    longitude: 121.505647
  },
  "22": {
    id: 22,
    name: '学生公寓22号楼',
    latitude: 30.842325,
    longitude: 121.505621
  },
  "23": {
    id: 23,
    name: '学生公寓23号楼',
    latitude: 30.841975,
    longitude: 121.504902
  },
  "24": {
    id: 24,
    name: '学生公寓24号楼',
    latitude: 30.842462,
    longitude: 121.505002
  },
  "25": {
    id: 25,
    name: '学生公寓25号楼',
    latitude: 30.846385,
    longitude: 121.513163
  },
  "26": {
    id: 26,
    name: '学生公寓26号楼',
    latitude: 30.847027,
    longitude: 121.51308
  },
};

const carPoints = [
  {longitude:121.507645,latitude:30.838272},
  {longitude:121.507522,latitude:30.838608},
  {longitude:121.507457,latitude:30.838792},
  {longitude:121.507377,latitude:30.839308},
  {longitude:121.507377,latitude:30.839543},
  {longitude:121.50742,latitude:30.839764},
  {longitude:121.50765,latitude:30.84033},
  {longitude:121.507763,latitude:30.840722},
  {longitude:121.507811,latitude:30.840925},
  {longitude:121.507811,latitude:30.841132},
  {longitude:121.5078,latitude:30.841265},
  {longitude:121.50764,latitude:30.841694},
  {longitude:121.507564,latitude:30.841855},
  {longitude:121.507441,latitude:30.84209},
  {longitude:121.507414,latitude:30.842177},
  {longitude:121.507404,latitude:30.842366},
  {longitude:121.507393,latitude:30.842435},
  {longitude:121.507404,latitude:30.842578},
  {longitude:121.507446,latitude:30.842725},
  {longitude:121.507548,latitude:30.842937},
  {longitude:121.507602,latitude:30.843066},
  {longitude:121.507865,latitude:30.84331},
  {longitude:121.508412,latitude:30.843605},
  {longitude:121.508653,latitude:30.843766},
  {longitude:121.50875,latitude:30.843831},
  {longitude:121.508986,latitude:30.844218},
  {longitude:121.509115,latitude:30.844388},
  {longitude:121.509244,latitude:30.844476},
  {longitude:121.509469,latitude:30.844623},
  {longitude:121.509603,latitude:30.844678},
  {longitude:121.509732,latitude:30.84472},
  {longitude:121.509914,latitude:30.844757},
  {longitude:121.510209,latitude:30.844793},
  {longitude:121.510611,latitude:30.844743},
  {longitude:121.510869,latitude:30.844687},
  {longitude:121.511089,latitude:30.844669},
  {longitude:121.511368,latitude:30.844683},
  {longitude:121.512816,latitude:30.844918},
  {longitude:121.512805,latitude:30.844982},
  {longitude:121.512773,latitude:30.845572},
  {longitude:121.514603,latitude:30.845475},
  {longitude:121.514608,latitude:30.845429},
  {longitude:121.514683,latitude:30.845365},
  {longitude:121.514796,latitude:30.845346},
  {longitude:121.514855,latitude:30.845365},
  {longitude:121.515194,latitude:30.844859},
  {longitude:121.515832,latitude:30.843754},
  {longitude:121.514636,latitude:30.843233},
  {longitude:121.511917,latitude:30.842035},
  {longitude:121.511655,latitude:30.841924},
  {longitude:121.511542,latitude:30.841846},
  {longitude:121.511435,latitude:30.841929},
  {longitude:121.511333,latitude:30.841962},
  {longitude:121.511231,latitude:30.841971},
  {longitude:121.511113,latitude:30.841952},
  {longitude:121.511043,latitude:30.841883},
  {longitude:121.510973,latitude:30.841805},
  {longitude:121.510963,latitude:30.841694},
  {longitude:121.509981,latitude:30.841736},
  {longitude:121.509809,latitude:30.841819},
  {longitude:121.507567,latitude:30.841833},
  {longitude:121.506156,latitude:30.841846},
  {longitude:121.506,latitude:30.841777},
  {longitude:121.505995,latitude:30.840563},
  {longitude:121.506,latitude:30.840475},
  {longitude:121.506081,latitude:30.840296},
  {longitude:121.506077,latitude:30.839292},
  {longitude:121.507375,latitude:30.839311},
  {longitude:121.507447,latitude:30.838864},
  {longitude:121.507458,latitude:30.838776},
  {longitude:121.507656,latitude:30.83826},
  {longitude:121.507656,latitude:30.83826}
];

export { campuses, fengxianPositions, fengxianDormitories, carPoints };
