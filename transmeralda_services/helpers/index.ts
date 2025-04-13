export const limitText = (text : string, maxLength : number) => 
  text.length > maxLength ? text.substring(0, maxLength) + '...' : text;