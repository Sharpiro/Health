class ResponseService
{
    public successCallBack = (response: any, message?: string): any =>
    {
        if (message)
            toastr.success(message);
        else if (response.data)
            toastr.success(response.data.data);
    }

    public errorCallBack = (response: any): any =>
    {
        if (response.data)
            toastr.error(`Error: ${response.data}`);
        else if (response.data.data)
            toastr.error(`Error: ${response.data.data}`);
        else
            toastr.error(`Error: ${response.statusText}`);
    }

    public callBack = (success: any, error: any): any =>
    {

    }
}

app.service("responseService", () => new ResponseService());
