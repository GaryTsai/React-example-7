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
        this.canvas.addEventListener('wheel', this.mouseWheel)
    }
    //When rerender the UI, remove the event listen
    componentWillUnmount() {
        this.canvas.removeEventListener('wheel', this.mouseWheel)
    }
    mouseWheel = (e) => {
        if (!this.canvas)
            return;
        const mousewheel = e.wheelDelta ? e.wheelDelta : e.delta ? e.delta : 0;
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
        this.canvas.width = position.width;
        this.canvas.height = position.height;
        this.canvas.getContext('2d').drawImage(video, position.zoom_x, position.zoom_y, position.zoom_width, position.zoom_height);
    }

    getImagePosition = (video , videoWidth ,videoHeight ) => {
        //Get canvas image style ratio from getCanvasRatio
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
        return (
            <div>
                <canvas  ref={video => this.canvas =video} style={{display: 'block',margin:'auto', width: '800px', height: '100%',transform:'scaleX(-1)'}}/>
            </div>
        );
    }
}

export default Canvas;