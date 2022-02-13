import {Dimensions, Platform} from 'react-native';
export const {width, height} = Dimensions.get('screen');
export const IS_ANDROID = Platform.OS === 'android';


export const getColor = (color :string) => {
  const isDarkMode = color==='dark'
  const numDarkFirst =  isDarkMode? 20 :70
  const numDarkSecond =isDarkMode? 15 : 85
    return (
      'hsl(' +
      360 * Math.random() +
      ',' +
      (25 + numDarkFirst * Math.random()) +
      '%,' +
      (numDarkSecond + 10 * Math.random()) +
      '%)'
    )
  }

  export const generateUUID = () => {
    let str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXZ';
    let uuid = [];
    for (let i = 0; i < 10; i++) {
        uuid.push(str[Math.floor(Math.random() * str.length)]);
    }
    return uuid.join('');
}

export const getParsedDate = (strDate:string)=>{
  var strSplitDate = String(strDate).split(' ');
  let date = new Date(strSplitDate[0]);
  // alert(date);
  var dd = date.getDate();
  var mm = date.getMonth() + 1; //January is 0!

  var yyyy = date.getFullYear();
  if (dd < 10) {
      dd = '0' + dd;
  }
  if (mm < 10) {
      mm = '0' + mm;
  }
  date =  dd + "-" + mm + "-" + yyyy;
  return date.toString();
}