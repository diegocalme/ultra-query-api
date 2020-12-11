export default function devPrint(...messages: any) {
  if(process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging') {
    console.log(...messages);
  }
}