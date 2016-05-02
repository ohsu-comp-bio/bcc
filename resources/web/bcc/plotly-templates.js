var timeline_template = function()
{
    this.textfont= {};
    this.error_x= {};
    this.error_y= {};
    this.yaxis= "";
    this.name= "";
    this.marker=
        {
            line:
            {
                //width: 2
            },
            //symbol: "square",
            size: 9
        };
    this.mode= "lines+markers";
    this.y= [];
    this.x= [];
    this.line=
        {
            //color:rgb(255, 127, 14),
            //width: 3
        };
    this.type= "scatter";
    this.uid= "";
    this.overlaying= "y";
};

var y_axis_template = function()
{
    this.title= "";
    this.domain= [0,1];
    this.showticklabels= true;
    //this.showexponent= "all";
    //this.gridcolor= "#eee";
    //this.linecolor= "#444";
    //this.mirror= false;
    this.linewidth= 1;
    this.autorange= true;
    this.nticks= 0;
    //this.zerolinecolor= "#444";
    //this.ticks= "";
    this.showgrid= true;
    //this.overlaying= "y";
    this.zeroline= true;
    this.type= "linear";
    //this.zerolinewidth= 1;
    this.ticklen= 5;
    this.titlefont=
        {
            //color: "",
            //family: "",
            //size: 0
        };
    //this.tickcolor= "#444";
    //this.showline= false;
    this.tickfont=
        {
            //color= "",
            //family: "",
            //size: 0
        };
    this.tickwidth= 1;
    //this.tick0= 0;
    this.tickangle= "auto";
    //this.gridwidth= 1;
    //this.dtick= 5;
    //this.side= "";
    this.rangemode= "normal";
    //this.range= [0.1, 27.289473684210527];
    //this.position= 0;
    this.anchor= "free";
    //this.exponentformat= "B";
    this.tickmode= "auto";
};

var x_axis_template = function()
{
    this.title= "x-axis";
    this.type = "date";
    this.titlefont=
        {
            color: "",
            family: "",
            size: 0
        };
    this.type= "linear";
    //domain= [0.08, 0.8];
    this.ticks= "outside";
    this.tickvals= [];
    this.ticktext= [];
    this.tickcolor= "#444";
    this.tickfont=
        {
            color: "rgb(107, 107, 107)",
            family: "",
            size: 11
        };
    this.tickwidth= 1;
    //this.tick0= 0;
    this.ticklen= 5;
    this.tickangle= 40;
    this.tickmode= "auto";
    this.showticklabels= true;
    //this.showexponent= "all";
    //this.showline= false;
    this.showgrid= true;
    //this.gridcolor= #eee;
    //this.linecolor= #444;
    //this.mirror= false;
    this.linewidth= 1;
    this.autorange= true;
    this.nticks= 0;
    //this.zerolinecolor= #444;
    //this.zerolinewidth= 1;
    //this.overlaying= false;
    //this.zeroline= false;
    //this.gridwidth= 1;
    //this.dtick= 2;
    //this.rangemode= "normal";
    //this.range= [0, 6.409927053599747];
    //this.position= 0;
    //this.anchor= "y";
    //this.exponentformat= "B";
};

var layout_template = function()
{
    //this.boxmode="overlay";
    //this.paper_bgcolor=#fff;
    //this.height=450;
    this.titlefont=
        {
            //color:"",
            //family:"",
            //size:0
        };
    //this.hovermode="x";
    this.font=
        {
            //color:#444,
            //family:"Open sans", verdana, arial, sans-serif",
            //size:12
        };
    //this.autosize=false;
    this.title="";
    //this.plot_bgcolor=#fff;
    //this.dragmode="zoom";
    //this.smith=false;
    //this.width=600;
    //this.bargap=0.2;
    //this.bargroupgap= 0;
    //this.hidesources= true;
    this.showlegend= true;
    this.separators= ".,";
    //this.barmode= "group";
    //this.boxgap= 0.3;
    this.legend=
    {
        //bordercolor: #444,
        //yanchor: "top",
        //traceorder: "normal",
        //xanchor: "left",
        //bgcolor: "rgba(255, 255, 255, 0)",
        //borderwidth: 0,
        //y: 0.9666666666666667,
        //x: 1.0476190476190477,
        font:
        {
            //color: "",
            //family: "",
            //size: 0
        }
    },
    this.position = 0;
};