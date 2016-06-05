class ResponseService
{
    public successCallBack = (data: any, message?: string): any =>
    {
        let debugObj = { message: "", data: "" };
        debugObj.data = data.data;
        debugObj.message = `${data.status}: ${data.statusText}`;
        if (message)
            toastr.success(message);
        return debugObj;
    }

    public errorCallBack = (error: any): any =>
    {
        let debugObj = { message: "", data: "" };
        debugObj.message = `${error.status}: ${error.statusText}`;
        debugObj.data = error.data;
        console.log(error);
        toastr.error(`Error: ${error.data}`);
        return debugObj;
    }
}

app.service("responseService", () => new ResponseService());
