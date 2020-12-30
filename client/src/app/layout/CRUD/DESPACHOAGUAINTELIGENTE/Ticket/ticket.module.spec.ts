import { TicketModule } from './ticket.module';

describe('TicketModule', () => {
   let blackPageModule: TicketModule;

   beforeEach(() => {
      blackPageModule = new TicketModule();   });

   it('should create an instance', () => {
      expect(blackPageModule).toBeTruthy();
   });
});