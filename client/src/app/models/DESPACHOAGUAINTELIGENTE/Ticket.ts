
export class Ticket {
   id: number;
   code: String;
   dispatcher_code: String;
   start_time: Date;
   end_time: Date;
   attended: Boolean;
   quantity: number;
   user_id: number;

   constructor() {
      this.id = 0;
      this.code = this.generate_code(10);
      this.dispatcher_code = '00000000';
      this.start_time = new Date();
      this.end_time = new Date();
      this.attended = false;
      this.quantity = 250;
      this.user_id = 0;
   }

   private generate_code(size: number) {
      let toReturn = '';
      for(let i = 0; i < size; i++) {
         toReturn += Math.floor(Math.random() * 9 + 1).toString();
      }
      return toReturn;
   }
}