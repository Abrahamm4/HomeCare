using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace HomeCareApi.Controllers
{
 // Base controller to unify error responses using ProblemDetails (with traceId)
 [ApiController]
 public abstract class BaseApiController : ControllerBase
 {
 protected ActionResult NotFoundProblem(string? detail = null, string? title = null)
 => BuildProblem(StatusCodes.Status404NotFound, title ?? "Not Found", detail);

 protected ActionResult BadRequestProblem(string? detail = null, string? title = null)
 => BuildProblem(StatusCodes.Status400BadRequest, title ?? "Bad Request", detail);

 protected ActionResult ConflictProblem(string? detail = null, string? title = null)
 => BuildProblem(StatusCodes.Status409Conflict, title ?? "Conflict", detail);

 protected ActionResult UnauthorizedProblem(string? detail = null, string? title = null)
 => BuildProblem(StatusCodes.Status401Unauthorized, title ?? "Unauthorized", detail);

 protected ActionResult ForbiddenProblem(string? detail = null, string? title = null)
 => BuildProblem(StatusCodes.Status403Forbidden, title ?? "Forbidden", detail);

 protected ActionResult InternalServerErrorProblem(string? detail = null, string? title = null)
 => BuildProblem(StatusCodes.Status500InternalServerError, title ?? "Internal Server Error", detail);

 private ObjectResult BuildProblem(int statusCode, string title, string? detail)
 {
 var traceId = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
 var problem = new ProblemDetails
 {
 Status = statusCode,
 Title = title,
 Detail = detail,
 Instance = HttpContext.Request.Path
 };
 problem.Extensions["traceId"] = traceId;
 problem.Extensions["errorCode"] = statusCode; // machine readable code
 problem.Extensions["method"] = HttpContext.Request.Method;
 return new ObjectResult(problem) { StatusCode = statusCode };
 }
 }
}
