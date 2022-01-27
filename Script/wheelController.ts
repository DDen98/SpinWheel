
import { _decorator, Component, Node, tween, UIOpacity, Label, EditBox } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WheelController')
export class WheelController extends Component {
    @property({ type: Node })
    wheelNode: any;
    @property({ type: Node })
    point: [] = [];
    @property({ type: Label })
    angle: any;
    @property({ type: EditBox })
    pickedId: any;


    isSpin = false;
    _spinSpeed: number = 0;
    tweenSpin: any;
    tweenStop: any;
    maxSpeed = 1000;
    cirleCount: number = 0;
    angleArr: any[] = [];
    pickedIdNumber: Number = 0;
    onLoad() {
        if (this.point && this.point.length > 0) {
            this.point.forEach(item => {
                let angle = this.calculateAngle(item);
                this.angleArr.push(angle);
            })
        }
        if (this.pickedId) {
            this.pickedIdNumber = parseInt(this.pickedId.string);
        }
        console.warn(this.angleArr);
    }
    calculateAngle(node: any) {
        let vector1 = this.node.getPosition();
        let vector2 = node.getPosition();
        let angle = (Math.atan2(vector2.y - vector1.y, vector2.x - vector1.x) * 180 / Math.PI)
        // console.warn(Math.atan2(vector2.y - vector1.y, vector2.x - vector1.x) * 180 / Math.PI);
        return angle;
    }

    onTextChange() {
        this.pickedIdNumber = parseInt(this.pickedId.string);
        console.warn(this.pickedIdNumber);
    }

    startSpinning() {
        if (this.isSpin) return;
        this.isSpin = true;
        this._spinSpeed = 20;
        this.tweenSpin = (tween(this) as any)
            .to(3, {
                _spinSpeed: this.maxSpeed
            }, { easing: 'sineOut' })
            .start();
    }
    stopSpinning() {
        if (!this.isSpin) return;
        let result = this.pickedIdNumber;

        let targetAngle = 0 - this.getStopAngle(result);
        let angleRoot = 360 * (this.cirleCount + 3);
        let angleStop = targetAngle + angleRoot;
        this.tweenSpin = null;
        this.isSpin = false;
        this.tweenStop = tween(this.wheelNode)
        this.tweenStop
            .to(1.5, {
                angle: angleStop
            }, { easing: 'sineOut' })
            .call(() => {
                console.warn(this.wheelNode.angle);
                this.tweenStop = null;
            })
        this.tweenStop.start();
    }
    getStopAngle(result: any) {
        return this.angleArr[result - 1];
    }
    lateUpdate(dt: any) {
        if (this.isSpin) {
            this.wheelNode.angle += (this._spinSpeed * dt);
        }
        if (this.wheelNode.angle - 360 * this.cirleCount > 360) {
            this.cirleCount++;
        }
        this.angle.string = Math.floor(this.wheelNode.angle - 360 * this.cirleCount);
    }
} 