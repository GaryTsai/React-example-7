import React, {Component} from 'react';

class Canvas extends Component {
    constructor(props) {
        super(props);
        this.position={};
        this.ZoomRatio = 10;
        this.canvasWidth = 800;
        this.canvasHeight = 450;
    }
    //event listen
    componentDidMount() {
        this.canvas.addEventListener('mousewheel', this.mouseWheel);//
        this.canvas.addEventListener('DOMMouseScroll', this.mouseWheel);//Firefox
    }
    //When rerender the UI, remove the event listen
    componentWillUnmount() {
        // this.canvas.removeEventListener('wheel', this.mouseWheel)
        this.canvas.removeEventListener('wheel', this.mouseWheel);//
        this.canvas.removeEventListener('DOMMouseScroll', this.mouseWheel);//Firefox
    }

    mouseWheel = (e) => {
        if (!this.canvas)
            return;
        const mousewheel = e.wheelDelta ? e.wheelDelta : e.detail ? -e.detail : 0;
        console.log(mousewheel);
        if (mousewheel > 0) {
            this.handleZoomIn();
        } else {
            this.handleZoomOut();
        }
    }
    handleZoomIn = () => {
        if (this.ZoomRatio + 1 > 20)
            return
        this.ZoomRatio = (this.ZoomRatio + 1);
    };
    handleZoomOut = () => {
        if (this.ZoomRatio - 1 < 0)
            return
        this.ZoomRatio = (this.ZoomRatio - 1);
    }

    draw =(video, videoWidth, videoHeight)=>{
        const position = this.getImagePosition(video,videoWidth,videoHeight);
        console.log('47 video Width&Height',videoWidth,videoHeight);
        console.log('48 position Width&Height',position.width,position.height);
        console.log('49 position Width&Height',position.zoom_width,position.zoom_height);
        this.canvas.width = position.width;
        this.canvas.height = position.height;
        console.log('50 canvas Width&Height',this.canvas.width,this.canvas.height);
        console.log('51 video ',video);


        this.canvas.getContext('2d').drawImage(video, position.zoom_x, position.zoom_y, position.zoom_width, position.zoom_height);
    }

    getImagePosition = (video , videoWidth ,videoHeight ) => {
        //Get canvas image ratio from getCanvasRatio
        const canvasScale = this.canvasWidth/this.canvasHeight;

        //Ratio of upload image
        const videoScale = videoWidth / videoHeight;

        if(videoScale > canvasScale){
            //Image position
            this.position.width = videoWidth;
            this.position.height = Math.round((videoWidth/canvasScale));
            this.position.x = 0;
            this.position.y = Math.round((this.position.height - videoHeight)/2) ;

            this.position.zoom_width = Math.round(this.position.width * this.ZoomRatio/10);
            this.position.zoom_height = Math.round(this.position.height * this.ZoomRatio)/10;
            this.position.zoom_x = Math.round((this.position.width - this.position.zoom_width) / 2);
            this.position.zoom_y = Math.round((this.position.height - this.position.zoom_height) / 2);

        }else{
            //Image position
            this.position.width =  Math.round((videoHeight*canvasScale));
            this.position.height = videoHeight;
            this.position.x = Math.round((this.position.width - videoWidth)/2) ;
            this.position.y = 0 ;

            this.position.zoom_width = Math.round(this.position.width * this.ZoomRatio/10);
            this.position.zoom_height = Math.round(this.position.height * this.ZoomRatio/10);
            this.position.zoom_x = Math.round((this.position.width  - this.position.zoom_width) / 2);
            this.position.zoom_y = Math.round((this.position.height - this.position.zoom_height) / 2);
        }

        return this.position
    };

    render() {
        const canvasStyle={display: 'block',margin:'auto',width:'800px',height:'100%',transform:'ScaleX(-1)'}

        return (
            <div>
                <canvas  ref={video => this.canvas =video} style={canvasStyle}/>
            </div>
        );
    }
}

export default Canvas;