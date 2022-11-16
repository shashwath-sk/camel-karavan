import React from 'react';
import {
    Button,
    Modal,
    FormGroup,
    ModalVariant,
    Form,
    TextInputGroupMain, TextInputGroup, Switch, FlexItem, Flex, TextInput
} from '@patternfly/react-core';
import './designer/karavan.css';
import {GithubApi, GithubParams} from "./api/GithubApi";
import {StorageApi} from "./api/StorageApi";

interface Props {
    yaml: string,
    filename: string,
    isOpen: boolean,
    onClose: (close: boolean, toast: boolean, ok: boolean, message: string) => void
}

interface State {
    token?: string
    owner?: string
    repo?: string
    path?: string
    branch?: string
    name?: string
    email?: string
    message?: string
    save: boolean
    pushing: boolean
}

export class GithubModal extends React.Component<Props, State> {

    public state: State = {
        save: false,
        pushing: false,
        path: this.props.filename
    }

    componentDidMount() {
        const githubParams = StorageApi.getGithubParameters();
        if (githubParams) {
            this.setState({
                owner: githubParams.owner,
                repo: githubParams.repo,
                path: githubParams.path,
                message: githubParams.message,
                name: githubParams.name,
                email: githubParams.email,
                branch: githubParams.branch ? githubParams.branch : "main",
            })
        }
    }

    closeModal = () => {
        this.props.onClose?.call(this, true, false, true, '');
    }

    saveAndCloseModal = () => {
        this.setState({pushing: true});
        const {owner, repo, path, name, email, message, branch, save, token} = this.state;
        if (owner && repo && path && name && email && message && branch && token) {
            const githubParams: GithubParams = {
                owner: owner,
                repo: repo,
                path: path,
                name: name,
                email: email,
                message: message,
                branch: branch
            };
            if (save) {
                StorageApi.setGithubParameters(githubParams)
            }
            GithubApi.pushFile(
                githubParams,
                token, this.props.yaml,
                result => {
                    this.setState({pushing: false});
                    this.props.onClose?.call(this, true, true, true, 'Saved')
                },
                reason => {
                    this.props.onClose?.call(this, false, true, false, reason.toString())
                    this.setState({pushing: false});
                }
            )
        }
    }

    render() {
        const {token, owner, repo, path, name, email, message, branch, save, pushing} = this.state;
        return (
            <Modal
                title="Github Commit Parameters"
                className="github-modal"
                variant={ModalVariant.medium}
                isOpen={this.props.isOpen}
                onClose={this.closeModal}
                actions={[
                    <Button isLoading={pushing} isDisabled={pushing} key="confirm" variant="primary" onClick={this.saveAndCloseModal}>Push</Button>,
                    <Button key="cancel" variant="secondary" onClick={this.closeModal}>Cancel</Button>
                ]}
            >
                <Form autoComplete="off" isHorizontal className="create-file-form">
                    <FormGroup label="Repository" fieldId="repository" isRequired>
                        <Flex direction={{default: "row"}} justifyContent={{default:"justifyContentSpaceBetween"}} alignItems={{default:"alignItemsStretch"}}>
                            <FlexItem>
                                <TextInput id="owner" placeholder="Owner" value={owner} onChange={value => this.setState({owner: value})}/>
                            </FlexItem>
                            <FlexItem>
                                <TextInput id="repo" placeholder="Repo" value={repo} onChange={value => this.setState({repo: value})}/>
                            </FlexItem>
                            <FlexItem>
                                <TextInput id="path" placeholder="Path" value={path} onChange={value => this.setState({path: value})}/>
                            </FlexItem>
                            <FlexItem>
                                <TextInput id="branch" placeholder="branch" value={branch} onChange={value => this.setState({branch: value})}/>
                            </FlexItem>
                        </Flex>
                    </FormGroup>
                    <FormGroup label="User" fieldId="user" isRequired>
                        <Flex direction={{default: "row"}} justifyContent={{default:"justifyContentSpaceBetween"}} alignItems={{default:"alignItemsStretch"}} >
                            <FlexItem>
                                <TextInput id="username" placeholder="Username" value={name} onChange={value => this.setState({name: value})}/>
                            </FlexItem>
                            <FlexItem flex={{default:"flex_2"}}>
                                <TextInput id="email" placeholder="Email" value={email} onChange={value => this.setState({email: value})}/>
                            </FlexItem>
                        </Flex>
                    </FormGroup>
                    <FormGroup label="Commit message" fieldId="commitMessage" isRequired>
                        <TextInputGroup className="input-group">
                            <TextInputGroupMain  id="message" value={message} onChange={value => this.setState({message: value})}/>
                        </TextInputGroup>
                    </FormGroup>
                    <FormGroup label="Token" fieldId="token" isRequired>
                        <TextInputGroup className="input-group">
                            <TextInputGroupMain id="token" type="password" value={token} onChange={value => this.setState({token: value})}/>
                        </TextInputGroup>
                    </FormGroup>
                    <FormGroup label="Save" fieldId="save" isRequired>
                        <TextInputGroup className="input-group">
                            <Switch label="Save parameters in browser (except token)" checked={save} onChange={checked => this.setState({save: checked})}/>
                        </TextInputGroup>
                    </FormGroup>
                </Form>
            </Modal>
        )
    }
}