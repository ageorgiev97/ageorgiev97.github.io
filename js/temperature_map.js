
    USGSOverlay.prototype = new google.maps.OverlayView();
    function USGSOverlay(bounds, image, map)
    {
        this.bounds_ = bounds;
        this.image_ = image;
        this.map_ = map;
    
        this.div_ = null;
        this.img_tag_ = null;
    
        this.setMap(map);
    }
    
    USGSOverlay.prototype.onAdd = function()
    {
        var div = document.createElement('div');
        div.style.border = 'none';
        div.style.borderWidth = '0px';
        div.style.position = 'absolute';
    
        var img = document.createElement('img');
        img.src = this.image_;
        img.style.width = '100%';
        img.style.height = '100%';
        div.appendChild(img);
    
        this.div_ = div;
        this.img_tag_ = img;
    
        var panes = this.getPanes();
        panes.overlayImage.appendChild(this.div_);
    };
    
    USGSOverlay.prototype.setImage = function(src)
    {
        this.image_ = src;
        
        if (this.img_tag_ != null)
        {
            this.img_tag_.src = src;
        }
    }
    
    USGSOverlay.prototype.draw = function()
    {
        var overlayProjection = this.getProjection();
    
        var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
        var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
    
        var div = this.div_;
        div.style.left = sw.x + 'px';
        div.style.top = ne.y + 'px';
        div.style.width = (ne.x - sw.x) + 'px';
        div.style.height = (sw.y - ne.y) + 'px';
    };
    
    USGSOverlay.prototype.onRemove = function()
    {
        this.div_.parentNode.removeChild(this.div_);
    };
    
    USGSOverlay.prototype.hide = function()
    {
        if (this.div_)
        {
            // The visibility property must be a string enclosed in quotes.
            this.div_.style.visibility = 'hidden';
        }
    };
    
    USGSOverlay.prototype.show = function()
    {
        if (this.div_)
        {
            this.div_.style.visibility = 'visible';
        }
    };
    
    USGSOverlay.prototype.toggle = function()
    {
        if (this.div_)
        {
            if (this.div_.style.visibility === 'hidden')
            {
                this.show();
            }
            else
            {
                this.hide();
            }
        }
    };
    
    USGSOverlay.prototype.toggleDOM = function()
    {
        if (this.getMap())
        {
            this.setMap(null);
        }
        else
        {
            this.setMap(this.map_);
        }
    };

    var data_size = 1206;
    var map;
    window.addEventListener('load',function ()
    {
        var center = new google.maps.LatLng(43.78125, 34.375);
        var myOptions = {
            zoom: 6,
            center: center,
            mapTypeId: google.maps.MapTypeId.HYBRID
        };
        map = new google.maps.Map(document.getElementById("temperature_map"), myOptions);
        set_data(0);
        
        $("#temperature_slider").slider({});
        
        $("#temperature_slider").slider('setAttribute', 'max', get_map_count());
        $("#temperature_slider").slider('setAttribute', 'value', 0);
        $("#temperature_slider").slider('refresh');
        
        $("#temperature_slider").slider().change(function(ev)
        {
            var value = $('#temperature_slider').data('slider').getValue();
            set_data(value);
        });
    });
    
    var overlay = null;
    var polygons = [];
    function set_data(idx)
    {
        if (idx >= get_map_count())
        {
            return;
        }
        
        var bounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(38.62577160493827, 26.375),
            new google.maps.LatLng(48.68827160493827, 42.375)
        );
        
        if (overlay == null)
        {
            overlay = new USGSOverlay(bounds, 'images/heatmap/heatmap_' + idx + '.png', map);
        }
        
        overlay.setImage('images/heatmap/heatmap_' + idx + '.png');
    }
    
    function get_map_count()
    {
        return data_size;
    }

