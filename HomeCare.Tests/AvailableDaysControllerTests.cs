using Xunit;
using Moq;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using HomeCareApi.Controllers;
using HomeCareApi.DAL;
using HomeCareApi.Models;
using HomeCareApi.Models.Dto;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public class AvailableDaysControllerTests
{
    // Helper creates controller with mock repo
    private AvailableDaysController CreateController(
        Mock<IAvailableDayRepository>? days = null,
        Mock<IPersonnelRepository>? personnel = null)
    {
        return new AvailableDaysController(
            days?.Object ?? new Mock<IAvailableDayRepository>().Object,
            personnel?.Object ?? new Mock<IPersonnelRepository>().Object,
            Mock.Of<ILogger<AvailableDaysController>>()
        );
    }

    // Helper BaseApiController needs HttpContext for ProblemDetails
    private void SetupHttpContext(ControllerBase controller, string method = "GET", string path = "/test")
    {
        var ctx = new DefaultHttpContext();
        ctx.TraceIdentifier = Guid.NewGuid().ToString();
        ctx.Request.Method = method;
        ctx.Request.Path = path;

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = ctx
        };
    }

    // Helper simple AvailableDay
    private AvailableDay MockDay(int id, int personnelId, bool booked = false)
    {
        return new AvailableDay
        {
            Id = id,
            PersonnelId = personnelId,
            Date = new DateTime(2025, 1, 10),
            StartTime = new TimeSpan(8, 0, 0),
            EndTime = new TimeSpan(10, 0, 0),
            Appointment = booked ? new Appointment() : null
        };
    }

    // GET BY ID

    [Fact]
    public async Task GetById_ShouldReturnOk_WhenFound()
    {
        var mock = new Mock<IAvailableDayRepository>();
        mock.Setup(r => r.GetByIdWithRelationsAsync(1))
            .ReturnsAsync(MockDay(1, 3));

        var controller = CreateController(mock);
        SetupHttpContext(controller);

        var response = await controller.GetById(1); 

        var ok = response.Result as OkObjectResult;
        ok.Should().NotBeNull();
        ok!.Value.Should().BeOfType<AvailableDayDto>();
        ((AvailableDayDto)ok.Value!).Id.Should().Be(1);
    }

    [Fact]
    public async Task GetById_ShouldReturnNotFound_WhenMissing()
    {
        var mock = new Mock<IAvailableDayRepository>();
        mock.Setup(r => r.GetByIdWithRelationsAsync(1))
            .ReturnsAsync((AvailableDay?)null);

        var controller = CreateController(mock);
        SetupHttpContext(controller);

        var response = await controller.GetById(1);

        var obj = response.Result as ObjectResult;
        obj.Should().NotBeNull();
        obj!.StatusCode.Should().Be(404);
    }

    // CREATE (POST)

    [Fact]
    public async Task Create_ShouldReturnCreated_WhenValid()
    {
        var model = MockDay(0, 3);
        model.Date = DateTime.Today.AddDays(1); // not past

        var mockRepo = new Mock<IAvailableDayRepository>();
        mockRepo.Setup(r => r.GetAllAsync())
                .ReturnsAsync(new List<AvailableDay>());
        mockRepo.Setup(r => r.CreateAsync(It.IsAny<AvailableDay>()))
                .ReturnsAsync(true);

        var controller = CreateController(mockRepo);
        SetupHttpContext(controller, "POST", "/api/availabledays");

        var response = await controller.Create(model); 

        var created = response.Result as CreatedAtActionResult;
        created.Should().NotBeNull($"Expected CreatedAtActionResult but got {response.Result?.GetType().Name}");
        created!.ActionName.Should().Be(nameof(AvailableDaysController.GetById));
        created.Value.Should().BeOfType<AvailableDayDto>();
    }

    [Fact]
    public async Task Create_ShouldReturnValidationProblem_WhenEndTimeBeforeStart()
    {
        var model = MockDay(0, 3);
        model.Date = DateTime.Today.AddDays(1);
        model.EndTime = new TimeSpan(7, 0, 0); // before start, it is invalid

        var mockRepo = new Mock<IAvailableDayRepository>();
        mockRepo.Setup(r => r.GetAllAsync())
                .ReturnsAsync(new List<AvailableDay>());

        var controller = CreateController(mockRepo);
        SetupHttpContext(controller, "POST");

        var response = await controller.Create(model);

        var bad = response.Result as ObjectResult;
        bad.Should().NotBeNull("ValidationProblem should produce ObjectResult");
        bad!.Value.Should().NotBeNull();
        bad.Value.Should().BeAssignableTo<ProblemDetails>();
        // Dont test status code here
    }

    [Fact]
    public async Task Create_ShouldReturnValidationProblem_WhenOverlapExists()
    {
        var existing = MockDay(1, 3);

        var model = MockDay(2, 3);
        model.Date = existing.Date;
        model.StartTime = new TimeSpan(9, 0, 0); // overlap 8–10

        var mockRepo = new Mock<IAvailableDayRepository>();
        mockRepo.Setup(r => r.GetAllAsync())
                .ReturnsAsync(new List<AvailableDay> { existing });

        var controller = CreateController(mockRepo);
        SetupHttpContext(controller, "POST");

        var response = await controller.Create(model);

        var bad = response.Result as ObjectResult;
        bad.Should().NotBeNull();
        bad!.Value.Should().BeAssignableTo<ProblemDetails>();
    }

    // UPDATE (PUT)

    [Fact]
    public async Task Update_ShouldReturnBadRequest_WhenIdMismatch()
    {
        var model = MockDay(1, 3);
        model.Date = DateTime.Today.AddDays(1);

        var controller = CreateController();
        SetupHttpContext(controller, "PUT");

        var response = await controller.Update(99, model); // id != model.Id

        var bad = response as ObjectResult;
        bad.Should().NotBeNull();
        bad!.StatusCode.Should().Be(400);
    }

    [Fact]
    public async Task Update_ShouldReturnInternalServerError_WhenRepositoryFails()
    {
        var model = MockDay(1, 3);
        model.Date = DateTime.Today.AddDays(1);

        var mockRepo = new Mock<IAvailableDayRepository>();
        mockRepo.Setup(r => r.GetAllAsync())
                .ReturnsAsync(new List<AvailableDay>());
        mockRepo.Setup(r => r.UpdateAsync(model))
                .ReturnsAsync(false); // Simulates DB-error

        var controller = CreateController(mockRepo);
        SetupHttpContext(controller, "PUT");

        var response = await controller.Update(1, model);

        var obj = response as ObjectResult;
        obj.Should().NotBeNull();
        obj!.StatusCode.Should().Be(500);
    }

    // DELETE

    [Fact]
    public async Task Delete_ShouldReturnNoContent_WhenSuccessful()
    {
        var mockRepo = new Mock<IAvailableDayRepository>();
        mockRepo.Setup(r => r.DeleteAsync(5)).ReturnsAsync(true);

        var controller = CreateController(mockRepo);
        SetupHttpContext(controller, "DELETE");

        var response = await controller.Delete(5);

        response.Should().BeOfType<NoContentResult>();
    }

    [Fact]
    public async Task Delete_ShouldReturnNotFound_WhenEntityDoesNotExist()
    {
        var mockRepo = new Mock<IAvailableDayRepository>();
        mockRepo.Setup(r => r.DeleteAsync(5)).ReturnsAsync(false);

        var controller = CreateController(mockRepo);
        SetupHttpContext(controller, "DELETE");

        var response = await controller.Delete(5);

        var obj = response as ObjectResult;
        obj.Should().NotBeNull();
        obj!.StatusCode.Should().Be(404);
    }
}
