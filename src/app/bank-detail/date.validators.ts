import {AbstractControl ,ValidationErrors} from '@angular/forms';

export class DateValidators{

    static invalidFormat(control : AbstractControl) : ValidationErrors | null
    {
        if((control.value as string).length!=10)
        {
            return {invalidFormat:true};
        }
        return null; 
    }

    static futureDate(control : AbstractControl) : ValidationErrors | null
    {
       if(new Date(control.value as string)>new Date())
       {
            return {futureDate:true};
       }
       return null;
    }
}