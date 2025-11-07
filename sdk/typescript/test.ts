import { DefaultApi } from './index';

const api = new DefaultApi();

api.getSyllabus().then((response) => {
  console.log('Successfully called getSyllabus');
  console.log(response);
}).catch((error) => {
  console.error('Error calling getSyllabus');
  console.error(error);
});
