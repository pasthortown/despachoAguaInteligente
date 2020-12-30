import { DispatcherModule } from './dispatcher.module';

describe('DispatcherModule', () => {
   let blackPageModule: DispatcherModule;

   beforeEach(() => {
      blackPageModule = new DispatcherModule();   });

   it('should create an instance', () => {
      expect(blackPageModule).toBeTruthy();
   });
});