import React, {
    Component,
} from 'react';

import {
    Text,
    View,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    Image,
    Platform
} from 'react-native';
import Dimensions from 'Dimensions';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux';


// Actions
import { setScreen, SCREENS } from 'ActionNavigation';

// i18n
import I18n from 'I18n'

/*
* props.navigator
*/
class TermsnPrivacyView extends Component {
    static navigatorStyle = {
        navBarHidden: true
    };
    constructor(props) {
        super(props);
        this.state = {
            pickerData: null
        }
    }

    back = () => {
        this.props.dispatch(setScreen(SCREENS.SIGNUP));
        this.props.navigator.pop({
            animated: true, // does the pop have transition animation or does it happen immediately (optional)
            animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the pop have different transition animation (optional)
        });
    };
    render() {
        return (
            <View style={styles.container}>

                <TouchableHighlight
                    style={styles.back}
                    underlayColor= '#EEEEEE'
                    onPress={ this.back.bind( this ) } >
                    <Image style={styles.backImg} source={{uri: 'icon_back_large'}} />
                </TouchableHighlight>

                <ScrollView>
                    <Text style={styles.title}>点点照用户协议</Text>
                    <Text style={styles.subTitle}>1. 关于本协议</Text>
                    <Text style={styles.paragraph}>欢迎您来到点点照。本协议由点点照平台与您签署，请您仔细阅读本协议的全部内容。本条款具有合同效力。一旦您注册成为点点照用户即表示您与点点照达成协议，完全接受以下的全部条款。</Text>

                    <Text style={styles.subTitle}>2. 服务内容</Text>
                    <Text style={styles.paragraph}>2.1</Text>
                    <Text style={styles.paragraph}>本协议的具体内容由点点照根据实际情况提供，点点照保留随时变更、中断或终止部分或全部服务的权利。点点照不承担因业务调整给用户造成的损失。除非本协议另有其它明示规定，增加或强化目前本协议的任何新功能，包括所推出的新产品，均受到本协议（含修订版本）之规范。用户了解并同意本协议仅依其当前所呈现的状况提供，对于任何用户通讯或个人化设定之时效、删除、传递错误、未予储存或其它任何问题，点点照均不承担任何责任。</Text>

                    <Text style={styles.subTitle}>3. 使用规则</Text>
                    <Text style={styles.paragraph}>3.1</Text>
                    <Text style={styles.paragraph}>用户注册成功后，点点照将给予每个用户一个账号及相应的密码，该账号和密码由用户自己负责保管；用户应当对该账号进行的所有活动和事件负法律责任。</Text>
                    <Text style={styles.paragraph}>3.2</Text>
                    <Text style={styles.paragraph}>用户须对注册信息的真实性、合法性、有效性承担全部责任，用户不得冒充他人；不得利用他人的名义发布任何信息；否则点点照有权立即停止其服务，收回其帐号并由用户独自承担由此而产生的一切法律责任。</Text>
                    <Text style={styles.paragraph}>3.3</Text>
                    <Text style={styles.paragraph}>用户承诺不得以任何方式利用点点照直接或间接从事违反中国法律、以及社会公德的活动，否则点点照有权立即停止其服务并收回其账号。</Text>
                    <Text style={styles.paragraph}>3.4 用户不得利用点点照制作、下载、复制、发布、传播或转载如下内容：</Text>
                    <Text style={styles.paragraph}> - 反对宪法所确定的基本原则的；</Text>
                    <Text style={styles.paragraph}> - 危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</Text>
                    <Text style={styles.paragraph}> - 损害国家荣誉和利益的；</Text>
                    <Text style={styles.paragraph}> - 煽动民族仇恨、民族歧视，破坏民族团结的；</Text>
                    <Text style={styles.paragraph}> - 破坏国家宗教政策，宣扬邪教和封建迷信的；</Text>
                    <Text style={styles.paragraph}> - 散布谣言，扰乱社会秩序，破坏社会稳定的；</Text>
                    <Text style={styles.paragraph}> - 散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</Text>
                    <Text style={styles.paragraph}> - 侮辱或者诽谤他人，侵害他人合法权益的；</Text>
                    <Text style={styles.paragraph}> - 含有法律、行政法规禁止的其他内容的信息。</Text>
                    <Text style={styles.paragraph}>3.5</Text>
                    <Text style={styles.paragraph}>点点照有权对用户使用点点照的情况进行审查和监督。如有用户举报或平台审查发现用户上传包含违背上诉规则内容，点点照或其授权人有权要求用户改正或直接采取一切必要的措施（包括但不限于更改或删除用户张贴的内容、期限时间内限制用户在点点照某些功能的使用、暂停或终止用户使用点点照的权利）以减轻用户不当行为造成的影响。</Text>

                    <Text style={styles.subTitle}>4. 内容所有权</Text>
                    <Text style={styles.paragraph}>4.1</Text>
                    <Text style={styles.paragraph}>点点照提供的服务内容可能包括：文字、软件、声音、图片、视频、图表等，所有这些内容受版权、商标和其它财产所有权法律的保护。</Text>
                    <Text style={styles.paragraph}>4.2</Text>
                    <Text style={styles.paragraph}>用户只有在获得点点照或其他相关权利人的授权之后才能使用这些内容，不能擅自复制、再造这些内容、或创造与内容有关的产品。</Text>
                    <Text style={styles.paragraph}>4.3</Text>
                    <Text style={styles.paragraph}>点点照鼓励用户充分利用点点照平台自由地张贴和共享自己的信息，但这些内容必须位于公共领域内，或者用户拥有这些内容的使用权。同时，用户对于其创作并在点点照上发布的合法内容依法享有著作权及其相关权利。用户不应通过点点照行张贴其它受版权保护的内容。点点照如果收到正式版权投诉，将会删除这些内容。</Text>
                    <Text style={styles.paragraph}>4.4</Text>
                    <Text style={styles.paragraph}>用户发表在点点照的原创图片等内容的版权均归用户本人所有。</Text>

                    <Text style={styles.subTitle}>5. 隐私保护</Text>
                    <Text style={styles.paragraph}>5.1</Text>
                    <Text style={styles.paragraph}>保护用户隐私是点点照的一项基本政策，点点照保证不对外公开或向第三方提供用户注册资料及用户在使用本平台时存储在点点照的非公开内容，但下列情况除外：</Text>
                    <Text style={styles.paragraph}> - 事先获得用户的明确授权；</Text>
                    <Text style={styles.paragraph}> - 根据有关的法律法规要求；</Text>
                    <Text style={styles.paragraph}> - 按照相关政府主管部门的要求；</Text>
                    <Text style={styles.paragraph}> - 为维护社会公众的利益；</Text>
                    <Text style={styles.paragraph}> - 维护面包旅行的合法权益。</Text>
                    <Text style={styles.paragraph}>5.2</Text>
                    <Text style={styles.paragraph}>点点照可能会与第三方合作向用户提供相关的服务，在此情况下，如该第三方同意承担与点点照同等的保护用户隐私的责任，则点点照无需用户书面同意可将用户的注册资料等提供给该第三方。</Text>
                    <Text style={styles.paragraph}>5.3</Text>
                    <Text style={styles.paragraph}>在不透露单个用户隐私资料的前提下，点点照有权对整个用户数据库进行分析并对用户数据库进行商业上的利用。</Text>

                    <Text style={styles.subTitle}>6. 免责声明</Text>
                    <Text style={styles.paragraph}>6.1</Text>
                    <Text style={styles.paragraph}>用户将照片、个人信息等资料上传到互联网上，有可能会被其他组织或个人复制、转载、擅改或做其它非法用途，用户必须充分意识此类风险的存在。用户明确同意其使用点点照服务所存在的风险（包括但不限于受到第三方侵权或对第三方造成侵权）将完全由其自己承担；因其使用点点照服务而产生的一切后果也由其自己承担，点点照对此不承担任何责任。</Text>
                    <Text style={styles.paragraph}>6.2</Text>
                    <Text style={styles.paragraph}>点点照不担保本协议一定能满足用户的要求，不担保服务不会中断，对服务的及时性、安全性、准确性、真实性、完整性也都不作担保。</Text>
                    <Text style={styles.paragraph}>6.3</Text>
                    <Text style={styles.paragraph}>对于因不可抗力或点点照不能控制的原因造成的服务中断或其它缺陷，点点照不承担任何责任，但将尽力减少因此而给用户造成的损失和影响。</Text>
                    <Text style={styles.paragraph}>6.4</Text>
                    <Text style={styles.paragraph}>根据有关法律法规，点点照在此郑重提醒用户注意，任何经由本平台上传、张贴、发送电子邮件或任何其它方式传送的资讯、资料、文字、软件、音讯、照片、图形、视讯、信息或其它资料（以下简称“内容”），无论是公开还是私下传送，均由内容提供者承担责任。点点照无法控制经由本平台传送之内容，因此不保证内容的正确性、完整性或品质。在任何情况下，点点照均不为任何内容负责，包含但不限于任何内容之任何错误或遗漏，以及经由本平台以张贴、发送电子邮件或其它方式传送任何内容而衍生之任何损失或损害。但点点照有权依法停止传输任何前述内容并采取相应行动，包括但不限于暂停用户使用本平台的全部或部分，保存有关记录，并向有关机关报告。</Text>
                    <Text style={styles.paragraph}>6.5</Text>
                    <Text style={styles.paragraph}>点点照对非法转载，虚假发布、盗版行为的发生等，对他人在网站上实施的此类侵权行为不承担法律责任，侵权的法律责任概由本人承担。</Text>
                    <Text style={styles.paragraph}>6.6</Text>
                    <Text style={styles.paragraph}>用户上传自行编辑的文字信息或拍摄图片等内容，点点照有权视为用户已将上述内容同意用于点点照自有的产品展示或者非盈利的市场活动宣传。</Text>

                    <Text style={styles.subTitle}>7. 协议修改</Text>
                    <Text style={styles.paragraph}>7.1</Text>
                    <Text style={styles.paragraph}>一旦本协议的内容发生变动，点点照将有权随时修改本协议的有关条款。</Text>
                    <Text style={styles.paragraph}>7.2</Text>
                    <Text style={styles.paragraph}>如果不同意点点照对本协议相关条款所做的修改，用户有权停止使用本平台。如果用户继续使用本平台，则视为用户接受点点照对本协议相关条款所做的修改。</Text>

                    <Text style={styles.subTitle}>8. 不可抗力</Text>
                    <Text style={styles.paragraph}>8.1</Text>
                    <Text style={styles.paragraph}>因不可抗力或者其他意外事件，使得本协议的履行不可能、不必要或者无意义的，双方均不承担责任。本合同所称之不可抗力意指不能预见、不能避免、不能克服的客观情况，包括但不限于战争、台风、水灾、火灾、雷击或地震、罢工、暴动、法定疾病、黑客攻击、网络病毒、电信部门技术管制、政府行为或任何其它自然或人为造成的灾难等客观情况。</Text>

                    <Text style={styles.subTitle}>本条款的最终解释权归点点照所有</Text>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 30,
        width: '100%',
        height: '100%',
        backgroundColor: '#F0F0F0'
    },
    /////
    title: {
        paddingTop: 50,
        paddingLeft: 20,
        paddingRight: 20,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold'
    },
    subTitle: {
        paddingTop: 30,
        paddingLeft: 20,
        paddingRight: 20,
        lineHeight: 30,
        fontSize: 15,
        fontWeight: 'bold'
    },
    paragraph: {
        paddingLeft: 20,
        paddingRight: 20,
        lineHeight: 30,
        fontSize: 13
    },
    //////
    back: {
        position: 'absolute',
        ...Platform.select({
            ios: {
                top: 30,
            },
            android: {
                top: 5,
            }
        }),
        left: 5,
        width: 40,
        height: 40,
        alignItems: "center",
        zIndex: 5
    },
    backImg: {
        marginTop: 7,
        width: 26,
        height: 26
    },
})
export default connect()(TermsnPrivacyView);
