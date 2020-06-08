// A form could take an object consisting of a dictionary of names and types or something similar
//  we have default ones and any additional are provided on the page using it


// form.create() - pass in an object { name: field.string({options}), email: field.string({confirm}).. etc }
// form.html() - generate html

export class FormHelper {
    public static GenerateForm(fields: Array<String>) {
        
    }

    public static Validate(params: Array<String>): boolean {
        return false;
    }

    private DefaultFields(): Array<String> {
        return ['hello', 'hello'];
    }
}