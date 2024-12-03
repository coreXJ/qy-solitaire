import { instantiate, isValid, NodePool, Prefab, Sprite, SpriteFrame,Node, v3, Button, UIOpacity, Tween } from "cc";
import { ResMgr } from "../manager/ResMgr";
import CardView from "../ui/game/CardView";
import { XUtils } from "../comm/XUtils";

class GameLoader {
    private _cardGeneralSprites: SpriteFrame[] = [];
    private _cardSprites: SpriteFrame[] = [];
    private _prefabs:Prefab[] = [];
    private _cardNodePool = new NodePool('CardPool');
    private _nodePoolWinPoolGold = new NodePool('NodePoolWinGold');
    public preloadNodes() {

    }

    public async loadAllGameRes() {
        await Promise.all([
            this.loadGeneralCardRes(),
            this.loadCardRes(),
            this.preloadPrefabs(),
        ]);
    }
    private loadGeneralCardRes(){
        return ResMgr.instance.loadDir('img/card/general', SpriteFrame, (err: Error, data: SpriteFrame[])=>{
            if(err){
                console.log('### loadGeneralCardRes err', err)
            }else{
                this._cardGeneralSprites = data; 
                console.log('### loadGeneralCardRes success',data);
            }
        })
    }
    private loadCardRes(skin = 'skin_hongse'){
        return ResMgr.instance.loadDir('img/card/'+skin, SpriteFrame, (err: Error, data: SpriteFrame[])=>{
            if(err){
                console.log('### loadCardRes err', err)
            }else{
                this._cardSprites = data; 
                console.log('### loadCardRes success',data);
            }
        })
    }
    public setCardFrame(sp: Sprite, cardValue: number){
        let frame: SpriteFrame = null;
        if (cardValue >= 0x40) {
            frame = this._cardGeneralSprites.find(ele=>ele.name == `card_${cardValue}`);
        } else {
            frame = this._cardSprites.find(ele=>ele.name == `card_${cardValue}`);
        }
        if(isValid(frame)){
            sp.spriteFrame = frame;
        }
    }
    public addCard(parent?: Node){
        let card: Node = null;
        if (this._cardNodePool.size() > 0) {
            card = this._cardNodePool.get();
            card.active = true;
            card.scale = v3(1, 1, 1);
            card.eulerAngles = v3(0, 0, 0);
            card.setPosition(0, 0, 0);
        } else {
            card = instantiate(this.getPrefab('CardView'));
        }
        card.parent = parent;
        const cardView = card.getComponent(CardView);
        cardView.cardValue = 0;
        return card;
    }

    public removeCard(...cardNodes: Node[]){
        for (const cardNode of cardNodes) {
            let card = cardNode.getComponent(CardView);
            if(isValid(card)){
                cardNode.getComponent(Button)?.destroy();
                XUtils.unbindClick(cardNode);
                const op = cardNode.getComponent(UIOpacity);
                cardNode.off(Node.EventType.TOUCH_START);
                if (op) {
                    Tween.stopAllByTarget(op);
                    op.opacity = 255;
                }
                card.reset();
                this._cardNodePool.put(cardNode);
            }
        }
    }
    public addWinPoolGold(prefab: Node){
        let node: Node = null;
        if (this._nodePoolWinPoolGold.size() > 0) {
            node = this._nodePoolWinPoolGold.get();
        } else {
            node = instantiate(prefab);
        }
        node.active = true;
        return node;
    }
    public removeWinPoolGold(...nodes: Node[]){
        for (const node of nodes) {
            Tween.stopAllByTarget(node);
            const op = node.getComponent(UIOpacity);
            if (op) {
                Tween.stopAllByTarget(op);
                op.opacity = 255;
            }
            this._nodePoolWinPoolGold.put(node);
        }
    }
    private async preloadPrefabs(){
        const names = ['CardView'];
        for (const name of names) {
            await this.loadPrefab(name);
        }
        console.log('预加载prefab完成',[...this._prefabs]);
    }
    public async loadPrefab(name:string) {
        this._prefabs = this._prefabs || [];
        let prefab = this.getPrefab(name);
        if (prefab) {
            return prefab;
        }
        const path = `prefab/game/${name}`;
        prefab = await ResMgr.instance.load(path, Prefab);
        this._prefabs.push(prefab);
        return prefab;
    }
    public getPrefab(name:string) {
        let prefab = this._prefabs.find(ele=>ele.name == name);
        if(isValid(prefab)){
            return prefab;
        }
    }
}

export default new GameLoader();