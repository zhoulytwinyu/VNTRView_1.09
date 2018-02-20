/*
 * Written by zhouly for VNTRView
 * GPLv3
 */

function assert(condition, message="Assertion failed") {
  if (!condition) {
    throw new Error(message);
  }
}

var BackboneWidget={
};

BackboneWidget.loader = "data:image/svg+xml;base64,PCEtLSBCeSBTYW0gSGVyYmVydCAoQHNoZXJiKSwgZm9yIGV2ZXJ5b25lLiBNb3JlIEAgaHR0cDovL2dvby5nbC83QUp6YkwgLS0+Cjxzdmcgd2lkdGg9IjEyMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDEyMCAzMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmaWxsPSIjZmZmIj4KICAgIDxjaXJjbGUgY3g9IjE1IiBjeT0iMTUiIHI9IjE1Ij4KICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJyIiBmcm9tPSIxNSIgdG89IjE1IgogICAgICAgICAgICAgICAgIGJlZ2luPSIwcyIgZHVyPSIwLjhzIgogICAgICAgICAgICAgICAgIHZhbHVlcz0iMTU7OTsxNSIgY2FsY01vZGU9ImxpbmVhciIKICAgICAgICAgICAgICAgICByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz4KICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJmaWxsLW9wYWNpdHkiIGZyb209IjEiIHRvPSIxIgogICAgICAgICAgICAgICAgIGJlZ2luPSIwcyIgZHVyPSIwLjhzIgogICAgICAgICAgICAgICAgIHZhbHVlcz0iMTsuNTsxIiBjYWxjTW9kZT0ibGluZWFyIgogICAgICAgICAgICAgICAgIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiAvPgogICAgPC9jaXJjbGU+CiAgICA8Y2lyY2xlIGN4PSI2MCIgY3k9IjE1IiByPSI5IiBmaWxsLW9wYWNpdHk9IjAuMyI+CiAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iciIgZnJvbT0iOSIgdG89IjkiCiAgICAgICAgICAgICAgICAgYmVnaW49IjBzIiBkdXI9IjAuOHMiCiAgICAgICAgICAgICAgICAgdmFsdWVzPSI5OzE1OzkiIGNhbGNNb2RlPSJsaW5lYXIiCiAgICAgICAgICAgICAgICAgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIC8+CiAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iZmlsbC1vcGFjaXR5IiBmcm9tPSIwLjUiIHRvPSIwLjUiCiAgICAgICAgICAgICAgICAgYmVnaW49IjBzIiBkdXI9IjAuOHMiCiAgICAgICAgICAgICAgICAgdmFsdWVzPSIuNTsxOy41IiBjYWxjTW9kZT0ibGluZWFyIgogICAgICAgICAgICAgICAgIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiAvPgogICAgPC9jaXJjbGU+CiAgICA8Y2lyY2xlIGN4PSIxMDUiIGN5PSIxNSIgcj0iMTUiPgogICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InIiIGZyb209IjE1IiB0bz0iMTUiCiAgICAgICAgICAgICAgICAgYmVnaW49IjBzIiBkdXI9IjAuOHMiCiAgICAgICAgICAgICAgICAgdmFsdWVzPSIxNTs5OzE1IiBjYWxjTW9kZT0ibGluZWFyIgogICAgICAgICAgICAgICAgIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiAvPgogICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImZpbGwtb3BhY2l0eSIgZnJvbT0iMSIgdG89IjEiCiAgICAgICAgICAgICAgICAgYmVnaW49IjBzIiBkdXI9IjAuOHMiCiAgICAgICAgICAgICAgICAgdmFsdWVzPSIxOy41OzEiIGNhbGNNb2RlPSJsaW5lYXIiCiAgICAgICAgICAgICAgICAgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIC8+CiAgICA8L2NpcmNsZT4KPC9zdmc+Cg=="; // From github:SamHerbert/SVG-Loaders"

BackboneWidget.View=Backbone.View.extend({
  loader:sprintf(`<div class="alert alert-info text-center"><img src="%s" alt="Loading"/></div>`,BackboneWidget.loader),
  initialize:function(options){
    this.setElement(options.el);
    this.$el.empty().append(this.loader);
  }
});

BackboneWidget.PageNavView=BackboneWidget.View.extend({
  template:`
    <nav aria-label="Page navigation">
      <ul class="pagination" style="margin:0px">
        %s
      </ul>
    </nav>
    <form class="center-block" style="width:100px">
      <div class="input-group">
        <input name="page" type="text" class="form-control">
        <span class="input-group-btn">
          <input class="btn btn-default" type="submit" value="Go!"/>
        </span>
      </div>
    </form>
  `,
  nav_item_template:`
    <li>
      <a href="%s">
        <span aria-hidden="true">%s</span>
      </a>
    </li>
  `,
  initialize: function( options ){
    BackboneWidget.View.prototype.initialize.apply(this,[options]);
    this.href_format=options.href_format;
  },
  render: function(){
    let self=this;
    let count=self.model.get("count");
    let page=self.model.get("page");
    let page_size=self.model.get("page_size");
    let max_page=Math.ceil(count/page_size);
    //Collect pages and symbols
    let pages=[];
    let symbols=[];
    if (page>1){
      pages.push(Math.min(page-1,max_page));
      symbols.push("|<");
      pages.push(Math.min(page-1,max_page));
      symbols.push("&laquo;");
    }
    for (let i=Math.max(1,page-4);i<=Math.min(max_page,page+4);i++){
      pages.push(i);
      symbols.push(i);
    }
    if (page<max_page){
      pages.push(Math.max(page+1,1));
      symbols.push("&raquo;");
      pages.push(max_page);
      symbols.push(">|");
    }
    //Format hrefs using this.href_format
    let hrefs=[];
    hrefs=pages.map(function(p){
      if (p==page){
        return "#";
      }
      else{
        return self.href_format(p);
      }
    });
    let nav_list="";
    let nav_item_template=self.nav_item_template;
    //Format nav links
    for (let i=0;i<hrefs.length;i++){
      nav_list+=sprintf(nav_item_template,hrefs[i],symbols[i]);
    }
    //Format nav widget
    let page_nav=self.template;
    self.$el.empty();
    self.$el.append(sprintf(page_nav,nav_list));
  }
});

BackboneWidget.MainNavView=BackboneWidget.View.extend({
  template:`
    <ul class="nav nav-tabs">
      %s
    </ul>
  `,
  nav_item_template:`
    <li role="presentation" %s><a href="%s">%s</a></li>
  `,
  initialize: function(options){
    BackboneWidget.View.prototype.initialize.apply(this,[options]);
    this.current_page=options.current_page;
  },
  render: function(){
    let self=this;
    let current_page=self.current_page;
    let nav_list="";
    for (let i=0;i<self.model.length;i++){
      let m=self.model.at(i);
      let state = m.get("name")==self.current_page ? `class="active"` : ``;
      let link = m.get("name")==self.current_page ? `#` : m.get("link");
      nav_list+=sprintf(self.nav_item_template,
                        state,
                        link,
                        m.get("name")
                        );
    }
    self.$el.empty();
    self.$el.append(sprintf(self.template,nav_list));
  }
});

BackboneWidget.TableView=BackboneWidget.View.extend({
  template:`
    <table class="table table-hover table-bordered">
      <thead>
        %s
      </thead>
      <tbody>
        %s
      </tbody>
    </table>
  `,
  initialize: function(options){
    BackboneWidget.View.prototype.initialize.apply(this,[options]);
    this.colnames=options.colnames;
    this.colformat=options.colformat;
  },
  render: function(){
    let self=this;
    let headers="";
    let rows="";
    let colnames=self.colnames;
    for (let i=0;i<colnames.length;i++){
      headers+=sprintf(`<th>%s</th>`,colnames[i]);
    }
    headers=sprintf(`<tr>%s</tr>`,headers);
    for (let i=0;i<self.model.length;i++){
      let m=self.model.at(i);
      let row="";
      for (let j=0;j<self.colnames.length;j++){
        row+=`<td>`+self.colformat(self.colnames[j],m)+`</td>`;
      }
      rows+=`<tr>`+row+`</tr>`;
    }
    self.$el.empty();
    self.$el.append(sprintf(self.template,headers,rows));
  }
});

BackboneWidget.SectionNavView=SQLSelectorView=BackboneWidget.View.extend({
  template:`
    <ul class="nav nav-pills nav-stacked" data-spy="affix" data-offset-top="%s">
      %s
    </ul>
  `,
  nav_item_template:`
    <li role="presentation"><a href="#%s">%s</a></li>
  `,
  initialize:function(options){
    BackboneWidget.View.prototype.initialize.apply(this,[options]);
    this.offset_top=options.offset_top;
  },
  render:function(){
    let self=this;
    let nav_list="";
    for (let i=0; i<self.model.length; i++){
      let m=self.model.at(i);
      nav_list+=sprintf(self.nav_item_template,m.get("id"),m.get("name"));
    }
    self.$el.empty();
    self.$el.append(sprintf(self.template,self.offset_top,nav_list));
  }
});

BackboneWidget.SQLSelectorView=BackboneWidget.View.extend({
  template:`
    <form action='%(action)s' method="GET">
      <table class="table table-hover table-bordered">
        <tr>
          <td style="width:50%%">
            <fieldset>
              <legend>Filter</legend>
              <div>
                <textarea id="filter_textarea" name="%(filter_query_name)s" style="width:100%%"></textarea>
                <div>
                  <select id="filter_field_selector">
                    <!-- Add filter field options-->
                  </select>
                  <select id="filter_oprt_selector">
                    <option value="<" selected="selected"><</option>
                    <option value="<="><=</option>
                    <option value="==">==</option>
                    <option value="!=">!=</option>
                    <option value=">">></option>
                    <option value=">=">>=</option>
                    <option value=">">></option>
                    <option value="is">is</option>
                    <option value="is_not">is not</option>
                  </select>
                  <input id="filter_value_input" type="text" style="width:100px"/>
                  <button id="filter_add_button" type="button">+</button>
                </div>
                <div>
                  <button id="filter_save_button" type="button">Save as Favorite</button>
                  <button id="filter_get_button" type="button">My Favorite</button>
                  <abbr title="Save currently displayed filters to cookie">?</abbr>
                </div>
              </div>
              <br/>
              <div id="filter_preset" class="alert alert-success" role="alert">
                Presets: <!-- Add presets -->
              </div>
            </fieldset>
          </td>
          <td style="width:50%%">
            <fieldset>
              <legend>Order</legend>
              <div>
                <textarea id="order_textarea" name="%(order_query_name)s" style="width:100%%"></textarea>
                <div>
                  <select id="order_field_selector">
                    <!-- Add order field options-->
                  </select>
                  <select id="order_order_selector">
                    <option value="ASC" title="ascending" selected="selected">ASC</option>
                    <option value="DESC" title="descending" >DESC</option>
                  </select>
                  <button id="order_add_button" type="button">+</button>
                </div>
                <div>
                  <button id="order_save_button" type="button">Save as Favorite</button>
                  <button id="order_get_button" type="button">My Favorite</button>
                  <abbr title="Save currently displayed orders to cookie">?</abbr>
                </div>
              </div>
              <br/>
              <div id="order_preset" class="alert alert-success" role="alert">
                Presets: <!-- Add presets -->
              </div>
            </fieldset>
          </td>
        </tr>
        <tr>
          <td>
            Records per page:
            <input id="page_size_input" type="text" name="%(page_size_name)s" style="width:100px"/>
          </td>
          <td class="text-right"><input type="submit" value="submit"/></td>
        </tr>
      </table>
    </form>
  `,
  option_template:`
    <option value="%s">%s</option>
  `,
  preset_button_template:`
    <button type="button" data-custom="%s">%s</button>
  `,
  initialize: function(options){
    BackboneWidget.View.prototype.initialize.apply(this,[options]);
    this.action=options.action;
    this.filter_query_name=options.filter_query_name;
    this.order_query_name=options.order_query_name;
    this.page_size_name=options.page_size_name;
    this.filter_fields=options.filter_fields;
    this.filter_fields_value=options.filter_fields_value;
    this.filter_presets=options.filter_presets;
    this.filter_presets_data=options.filter_presets_data;
    this.order_fields=options.order_fields;
    this.order_fields_value=options.order_fields_value;
    this.order_presets=options.order_presets;
    this.order_presets_data=options.order_presets_data;
    this.queries=options.queries;
  },
  render: function(){
    let form = sprintf( this.template,{ action:this.action,
                                        filter_query_name:this.filter_query_name,
                                        order_query_name:this.order_query_name,
                                        page_size_name:this.page_size_name
                                        }
                      );
    form=$.parseHTML(form);
    //Filter fieldset
    let filter_textarea_dom=$( "#filter_textarea",form );
    let filter_field_selector_dom=$( "#filter_field_selector",form );
    let filter_oprt_selector_dom=$( "#filter_oprt_selector",form );
    let filter_value_input_dom=$( "#filter_value_input",form );
    let filter_add_button_dom=$( "#filter_add_button",form );
    let filter_save_button_dom=$( "#filter_save_button",form );
    let filter_get_button_dom=$( "#filter_get_button",form );
    let filter_preset_dom=$( "#filter_preset",form );
    //Order fieldset
    let order_textarea_dom=$( "#order_textarea",form );
    let order_field_selector_dom=$( "#order_field_selector",form );
    let order_order_selector_dom=$( "#order_order_selector",form );
    let order_add_button_dom=$( "#order_add_button",form );
    let order_save_button_dom=$( "#order_save_button",form );
    let order_get_button_dom=$( "#order_get_button",form );
    let order_preset_dom=$( "#order_preset",form );
    //Page size input
    let page_size_dom=$( "#page_size_input",form );
    //Fill in textarea
    filter_textarea_dom.html(this.queries.get(this.filter_query_name));
    order_textarea_dom.html(this.queries.get(this.order_query_name));
    page_size_dom.val(this.queries.get(this.page_size_name))
    //Add options
    for (let i=0;i<this.filter_fields.length;i++){
      filter_field_selector_dom.append(sprintf(this.option_template,
                                               this.filter_fields_value[i],
                                               this.filter_fields[i]
                                              )
                                      );
    }
    for (let i=0;i<this.order_fields.length;i++){
      order_field_selector_dom.append(sprintf(this.option_template,
                                              this.order_fields_value[i],
                                              this.order_fields[i]
                                             )
                                     );
    }
    //Connect buttons events: filter
    filter_add_button_dom.on("click",function (){
      let filter_string=filter_textarea_dom.val().trim();
      if (filter_string!=""){
        filter_string+=" AND ";
      }
      filter_string+=sprintf("%s %s \"%s\"",filter_field_selector_dom.val(),filter_oprt_selector_dom.val(),filter_value_input_dom.val());
      filter_textarea_dom.val(filter_string);
    });
    filter_save_button_dom.on("click",function (){
      Cookies.set("filter",filter_textarea_dom.val() , { expires: 356, path: "" });
    });
    filter_get_button_dom.on("click",function (){
      filter_textarea_dom.val(Cookies.get("filter"));
    });
    //Connect buttons events: order
    order_add_button_dom.on("click",function (){
      let order_string=order_textarea_dom.val().trim();
      if (order_string!=""){
        order_string+=", ";
      }
      order_string+=sprintf("%s %s",order_field_selector_dom.val(),order_order_selector_dom.val());
      order_textarea_dom.val(order_string);
    });
    order_save_button_dom.on("click",function (){
      Cookies.set("order",order_textarea_dom.val() , { expires: 356, path: "" });
    });
    order_get_button_dom.on("click",function (){
      order_textarea_dom.val(Cookies.get("order"));
    });
    //Presets: filter
    for (let i=0;i<this.filter_presets.length;i++){
      let button=sprintf( this.preset_button_template,
                          this.filter_presets_data[i],
                          this.filter_presets[i]
                          );
      filter_preset_dom.append(button);
    }
    filter_preset_dom.on("click","button",function(event){
      let source = event.target || event.srcElement;
      filter_textarea_dom.val($(source).attr("data-custom"));
    });
    //Presets: order
    for (let i=0;i<this.order_presets.length;i++){
      let button=sprintf( this.preset_button_template,
                          this.order_presets_data[i],
                          this.order_presets[i]
                          );
      order_preset_dom.append(button);
    }
    order_preset_dom.on("click","button",function(event){
      let source = event.target || event.srcElement;
      order_textarea_dom.val($(source).attr("data-custom"));
    });
    this.$el.empty();
    this.$el.html(form);
  }
});

BackboneWidget.RecordsIndicatorView=BackboneWidget.View.extend({
  template:`
    <p>Showing %s - %s out of %s records.</p>
  `,
  initialize:function(options){
    BackboneWidget.View.prototype.initialize.apply(this,[options]);
  },
  render:function(){
    let page=this.model.get("page");
    let page_size=this.model.get("page_size");
    let count=this.model.get("count");
    let html="";
    if ( page<1 | page>Math.ceil(count/page) ){
      html=sprintf( this.template,
                    "NA",
                    "NA",
                    count);
    }
    else {
      html=sprintf( this.template,
                    (page-1)*page_size+1,
                    Math.min( count,
                              page*page_size
                              ),
                    count);
    }
    this.$el.empty();
    this.$el.append(html);
  }
});

BackboneWidget.FlatFormView=BackboneWidget.View.extend({
  template:`
    <form action='%s' method="GET">
      %s
      <input type="submit" value="submit"/>
    </form>
  `,
  select_format:function(m){
    let options="";
    for (let i=0;i<m.opdisplay.length;i++){
      options+=sprintf( `<option value="%s" %s>%s</option>`,
                        m.opvalue[i],
                        this.queries.get(m.name)==m.opvalue[i] ? `selected="selected"` : "",
                        m.opdisplay[i]
                        );
    }
    return sprintf( `%s<select name="%s">%s</select>`,
                    m.display,
                    m.name,
                    options
                    );
  },
  text_input_format:function(m){
    return sprintf( `%s<input type="text" name="%s" value="%s"/>`,
                    m.display,
                    m.name,
                    this.queries.get(m.name)
                    );
  },
  content:"",
  add:function(type,m){
    if (type=="textinput"){
      this.content+=this.text_input_format(m);
    }
    if (type=="select"){
      this.content+=this.select_format(m);
    }
  },
  initialize:function(options){
    BackboneWidget.View.prototype.initialize.apply(this,[options]);
    this.action=options.action;
    this.queries=options.queries;
  },
  render:function(){
    let html=sprintf( this.template,
                      this.action,
                      this.content
                      );
    this.$el.empty();
    this.$el.append(html);
  }
});
