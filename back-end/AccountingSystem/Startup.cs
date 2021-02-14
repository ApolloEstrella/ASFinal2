using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using AccountingSystem.Data;
using AccountingSystem.Services;
using AccountingSystem.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using AccountingSystem.Data.Entities;

namespace AccountingSystem
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(o => o.AddPolicy("MyPolicy", builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            }));




            services.AddControllers();
            services.AddDbContext<accounting_systemContext>(options => options.UseSqlServer("Server=DESKTOP-GT4AAMB;Database=accounting_system;Trusted_Connection=True;"));
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<IChartOfAccountService, ChartOfAccountService>();
            services.AddScoped<ISubsdiaryLedgerService, SubsdiaryLedgerService>();
            services.AddScoped<IIncomeItemService, IncomeItemService>();
            services.AddScoped<ITaxRateService, TaxRateService>();
            services.AddScoped<ITrackingService, TrackingService>();
            services.AddScoped<ISalesService, SalesService>();
            services.AddScoped<IFileAttachmentService, FileAttachmentService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCors("MyPolicy");
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

             

        }
    }
}
