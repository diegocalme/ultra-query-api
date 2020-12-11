export default function devPrint(msg: any) {
  if(process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging') {
    console.log(msg);
  }
}